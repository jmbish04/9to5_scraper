import { Env } from './index.js';
import { crawlJob } from './crawl.js';

export async function discover(env: Env, urls: string[]) {
  for (const url of urls) {
    const seen = await env.KV.get(`seen:${url}`);
    if (seen) continue;
    await env.KV.put(`seen:${url}`, '1');
    await crawlJob(env, url);
  }
}
