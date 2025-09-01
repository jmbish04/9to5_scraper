import { Job } from './schemas.js';

export interface JobDiff {
  field: keyof Job;
  from?: any;
  to?: any;
}

export function diffJobs(a: Job, b: Job): JobDiff[] {
  const changes: JobDiff[] = [];
  for (const key of Object.keys(b) as (keyof Job)[]) {
    if (a[key] !== b[key]) {
      changes.push({ field: key, from: a[key], to: b[key] });
    }
  }
  return changes;
}
