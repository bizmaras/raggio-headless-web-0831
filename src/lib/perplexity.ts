import Perplexity, { Responses } from '@perplexity-ai/perplexity_ai';

export type AgentPreset = 'fast' | 'low' | 'medium' | 'high' | 'xhigh' | 'wide-research';

export interface SearchResultItem {
  id?: number | string;
  title: string;
  url: string;
  snippet?: string;
  source?: string;
  date?: string;
}

export interface AgentQueryOptions {
  /** Text prompt or conversation array */
  input: string | unknown[];
  /** Preset configuration: 'fast' (quick fact lookups), 'low' (everyday research with citations), etc. */
  preset?: AgentPreset;
  /** Direct model override (e.g. 'openai/gpt-5.6-sol' or 'anthropic/claude-3-5-sonnet') */
  model?: string;
  /** System prompt / behavioral instructions for the agent */
  instructions?: string;
  /** Pass previous response ID to continue conversation in multi-turn */
  previousResponseId?: string;
  /** Custom tools to enable (web_search, fetch_url, finance_search, sandbox) */
  tools?: Array<{ type: string; [key: string]: unknown }>;
  /** Structured output JSON schema format */
  responseFormat?: Record<string, unknown>;
  /** Temperature (0.0 to 2.0) */
  temperature?: number;
}

export interface AgentQueryResult {
  id: string;
  outputText: string;
  model: string;
  status: string;
  searchResults: SearchResultItem[];
  citations: string[];
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
    totalTokens?: number;
    totalCost?: number;
  };
  previousResponseId?: string | null;
  raw: unknown;
}

/**
 * Returns an instance of the official Perplexity SDK client.
 * Strictly resolves API key from PERPLEXITY_API_KEY environment variable.
 */
export function getPerplexityClient(): Perplexity {
  const apiKey = process.env.PERPLEXITY_API_KEY;
  if (!apiKey) {
    throw new Error(
      'PERPLEXITY_API_KEY is not defined. Please configure it in .env.local or environment variables. Get a key at https://console.perplexity.ai'
    );
  }
  return new Perplexity({ apiKey });
}

/**
 * Query the Perplexity Agent API (POST https://api.perplexity.ai/v1/agent)
 */
export async function queryPerplexityAgent(options: AgentQueryOptions): Promise<AgentQueryResult> {
  const client = getPerplexityClient();

  const requestParams: Record<string, unknown> = {
    input: options.input,
  };

  // Either use preset (recommended) or specific model
  if (options.preset) {
    requestParams.preset = options.preset;
  } else if (options.model) {
    requestParams.model = options.model;
  } else {
    // Default to 'low' preset: includes web search, grounding, citations, and light multi-step reasoning
    requestParams.preset = 'low';
  }

  if (options.instructions) {
    requestParams.instructions = options.instructions;
  }

  if (options.previousResponseId) {
    requestParams.previous_response_id = options.previousResponseId;
  }

  if (options.tools && options.tools.length > 0) {
    requestParams.tools = options.tools;
  }

  if (options.responseFormat) {
    requestParams.response_format = options.responseFormat;
  }

  if (typeof options.temperature === 'number') {
    requestParams.temperature = options.temperature;
  }

  const response = (await client.responses.create(
    requestParams as unknown as Parameters<typeof client.responses.create>[0]
  )) as Responses.ResponseCreateResponse;

  // Extract search results and citations
  const searchResults: SearchResultItem[] = [];
  const citations: string[] = [];

  const rawOutput = (response as unknown as { output?: Array<Record<string, unknown>> }).output;
  if (Array.isArray(rawOutput)) {
    for (const item of rawOutput) {
      if (Array.isArray(item.results)) {
        for (const res of item.results as Array<Record<string, unknown>>) {
          const url = typeof res.url === 'string' ? res.url : undefined;
          if (url) {
            searchResults.push({
              id: (res.id as number | string) || undefined,
              title: (res.title as string) || '',
              url,
              snippet: (res.snippet as string) || '',
              source: (res.source as string) || 'web',
              date: res.date as string | undefined,
            });
            if (!citations.includes(url)) {
              citations.push(url);
            }
          }
        }
      }

      if (Array.isArray(item.content)) {
        for (const part of item.content as Array<Record<string, unknown>>) {
          if (Array.isArray(part.annotations)) {
            for (const ann of part.annotations as Array<Record<string, unknown>>) {
              const annUrl = typeof ann.url === 'string' ? ann.url : undefined;
              if (annUrl && !citations.includes(annUrl)) {
                citations.push(annUrl);
              }
            }
          }
        }
      }
    }
  }

  return {
    id: response.id,
    outputText: response.output_text || '',
    model: response.model || '',
    status: response.status || 'completed',
    searchResults,
    citations,
    usage: {
      inputTokens: response.usage?.input_tokens,
      outputTokens: response.usage?.output_tokens,
      totalTokens: response.usage?.total_tokens,
      totalCost: (response.usage as unknown as { cost?: { total_cost?: number } })?.cost?.total_cost,
    },
    previousResponseId: response.id,
    raw: response,
  };
}
