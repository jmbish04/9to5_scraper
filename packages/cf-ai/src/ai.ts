import type { Ai, Vectorize } from '@cloudflare/workers-types';
import { JobSchema, Job } from '@job-scraper/shared';

export interface Env {
  AI: Ai;
  VECTORIZE_INDEX: Vectorize;
}

export async function extractJob(env: Env, html: string, url: string, site: string): Promise<Job | null> {
  const prompt = `Extract structured job fields from HTML for ${site} at ${url}`;
  const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', {
    prompt: `${prompt}\n${html}`
  });
  try {
    const json = JSON.parse(response.response ?? '{}');
    return JobSchema.parse(json);
  } catch {
    return null;
  }
}

export async function embedText(env: Env, text: string): Promise<number[] | undefined> {
  const res: any = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text });
  return res.data?.[0]?.embedding;
}
