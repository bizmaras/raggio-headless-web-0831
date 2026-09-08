import { NextResponse } from 'next/server';
import { queryPerplexityAgent, AgentPreset } from '@/lib/perplexity';
import { AuthenticationError, RateLimitError, APIError } from '@perplexity-ai/perplexity_ai';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
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

    const result = await queryPerplexityAgent({
      input: queryInput,
      preset: preset as AgentPreset,
      model: typeof model === 'string' ? model : undefined,
      instructions: typeof instructions === 'string' ? instructions : undefined,
      previousResponseId: typeof previous_response_id === 'string' ? previous_response_id : undefined,
      tools: Array.isArray(tools) ? (tools as Array<{ type: string; [key: string]: unknown }>) : undefined,
      responseFormat: typeof response_format === 'object' && response_format !== null ? (response_format as Record<string, unknown>) : undefined,
      temperature: typeof temperature === 'number' ? temperature : undefined,
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
          error: 'Authentication failed. Please check PERPLEXITY_API_KEY.',
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
          error: error.message,
          type: 'api_error',
          status: error.status,
        },
        { status: error.status || 500 }
      );
    }

    const genericError = error as Error;
    return NextResponse.json(
      {
        error: genericError?.message || 'Internal Server Error',
        type: 'internal_error',
      },
      { status: 500 }
    );
  }
}
