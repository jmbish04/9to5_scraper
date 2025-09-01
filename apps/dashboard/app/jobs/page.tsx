"use client";
import useSWR from 'swr';
import { Job } from '@job-scraper/shared';

const fetcher = (url: string) => fetch(url, { headers: { Authorization: 'Bearer test-token' } }).then(r => r.json());

export default function JobsPage() {
  const { data } = useSWR<Job[]>('/api/jobs', fetcher);
  return (
    <main>
      <h1>Jobs</h1>
      <ul>{data?.map(j => (<li key={j.id}>{j.title}</li>))}</ul>
    </main>
  );
}
