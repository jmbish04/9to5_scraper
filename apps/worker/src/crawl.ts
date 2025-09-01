import { Env } from './index.js';
import { extractJob } from '@job-scraper/cf-ai';
import { saveJob } from './storage.js';

export async function crawlJob(env: Env, url: string) {
  const res = await fetch('https://browser.render/api/render', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${env.BROWSER_RENDERING_TOKEN}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ url })
  });
  const html = await res.text();
  const job = await extractJob(env, html, url, url);
  if (job) {
    job.url = url;
    await saveJob(env, job);
  }
}
