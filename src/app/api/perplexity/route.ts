import { NextResponse } from 'next/server';
import { queryPerplexityAgent, AgentPreset } from '@/lib/perplexity';
import { AuthenticationError, RateLimitError, APIError } from '@perplexity-ai/perplexity_ai';

export const runtime = 'nodejs';

const ALLOWED_PRESETS = new Set(['fast', 'low', 'medium', 'high', 'xhigh', 'wide-research']);
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX_REQUESTS = 10;
const rateLimitMap = new Map<string, { count: number; windowStart: number }>();

function isRateLimited(identifier: string): boolean {
  const now = Date.now();
  if (rateLimitMap.size > 500) {
    for (const [key, val] of rateLimitMap.entries()) {
      if (now - val.windowStart > RATE_LIMIT_WINDOW_MS) {
        rateLimitMap.delete(key);
      }
    }
  }

  const entry = rateLimitMap.get(identifier);
  if (!entry || now - entry.windowStart > RATE_LIMIT_WINDOW_MS) {
    rateLimitMap.set(identifier, { count: 1, windowStart: now });
    return false;
  }
  entry.count += 1;
  return entry.count > RATE_LIMIT_MAX_REQUESTS;
}

export async function POST(req: Request) {
  try {
    // 1. Strict Fail-Closed Authentication
    const authHeader = req.headers.get('authorization');
    const secret = process.env.PERPLEXITY_API_SECRET;
    if (!secret || authHeader !== `Bearer ${secret}`) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // 2. Rate Limiting
    const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || req.headers.get('x-real-ip') || 'unknown';
    if (isRateLimited(ip)) {
      return NextResponse.json({ error: 'Too Many Requests' }, { status: 429 });
    }

    const body = (await req.json()) as Record<string, unknown>;
    const {
      prompt,
      input,
      preset = 'low',
      model,
      instructions,
      previous_response_id,
      tools,
      response_format,
      temperature,
    } = body;

    const queryInput = (prompt || input) as string | unknown[];
    if (!queryInput) {
      return NextResponse.json(
        { error: 'Missing required field: "prompt" or "input"' },
        { status: 400 }
      );
    }

    if (typeof queryInput === 'string' && queryInput.length > 5000) {
      return NextResponse.json(
        { error: 'Input exceeds maximum allowed size of 5000 characters.' },
        { status: 400 }
      );
    }

    const safePreset = typeof preset === 'string' && ALLOWED_PRESETS.has(preset) ? preset : 'low';

    const result = await queryPerplexityAgent({
      input: queryInput,
      preset: safePreset as AgentPreset,
      model: typeof model === 'string' ? model : undefined,
      instructions: typeof instructions === 'string' ? instructions : undefined,
      previousResponseId: typeof previous_response_id === 'string' ? previous_response_id : undefined,
      tools: Array.isArray(tools) ? (tools as Array<{ type: string; [key: string]: unknown }>) : undefined,
      responseFormat: typeof response_format === 'object' && response_format !== null ? (response_format as Record<string, unknown>) : undefined,
      temperature: typeof temperature === 'number' ? Math.max(0, Math.min(2, temperature)) : undefined,
    });

    return NextResponse.json({
      success: true,
      id: result.id,
      model: result.model,
      answer: result.outputText,
      citations: result.citations,
      searchResults: result.searchResults,
      usage: result.usage,
      previous_response_id: result.id,
    });
  } catch (error: unknown) {
    if (error instanceof AuthenticationError || (error as { status?: number })?.status === 401) {
      return NextResponse.json(
        {
          error: 'Authentication failed with upstream provider.',
          type: 'authentication_error',
        },
        { status: 401 }
      );
    }

    if (error instanceof RateLimitError || (error as { status?: number })?.status === 429) {
      const retryAfter = (error as { headers?: { get?: (header: string) => string | null } })?.headers?.get?.('retry-after') || '60';
      return NextResponse.json(
        {
          error: 'Perplexity rate limit reached. Please retry later.',
          type: 'rate_limit_error',
        },
        {
          status: 429,
          headers: {
            'Retry-After': retryAfter,
          },
        }
      );
    }

    if (error instanceof APIError) {
      return NextResponse.json(
        {
          error: 'Upstream API error occurred.',
          type: 'api_error',
        },
        { status: error.status || 500 }
      );
    }

    return NextResponse.json(
      {
        error: 'An internal error occurred.',
        type: 'internal_error',
      },
      { status: 500 }
    );
  }
}
