import { Env } from './index.js';
import { Job } from '@job-scraper/shared';

export async function saveJob(env: Env, job: Job) {
  const id = job.id || crypto.randomUUID();
  await env.DB.prepare(
    `INSERT OR REPLACE INTO jobs(id,url,canonical_url,title,company,location,employment_type,salary_min,salary_max,salary_currency,salary_raw,description_md,posted_at,status) VALUES(?1,?2,?3,?4,?5,?6,?7,?8,?9,?10,?11,?12,?13,?14)`
  )
    .bind(
      id,
      job.url,
      job.canonicalUrl,
      job.title,
      job.company,
      job.location,
      job.employmentType,
      job.salaryMin,
      job.salaryMax,
      job.salaryCurrency,
      job.salaryRaw,
      job.descriptionMd,
      job.postedAt,
      'open'
    )
    .run();
  if (job.descriptionMd) {
    const emb = await env.AI.run('@cf/baai/bge-base-en-v1.5', { text: job.descriptionMd });
    const vec = emb.data?.[0]?.embedding;
    if (vec) {
      await env.VECTORIZE_INDEX.upsert([{ id, values: vec }]);
    }
  }
  return id;
}
