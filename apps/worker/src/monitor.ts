import { Env } from './index.js';
import { crawlJob } from './crawl.js';

export async function monitor(env: Env) {
  const res = await env.DB.prepare('SELECT url FROM jobs WHERE status="open" LIMIT 50').all();
  for (const row of res.results as any[]) {
    await crawlJob(env, row.url);
  }
}
