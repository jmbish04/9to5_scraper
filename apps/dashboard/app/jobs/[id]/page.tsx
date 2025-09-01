interface Props { params: { id: string } }
export default async function JobDetail({ params }: Props) {
  const res = await fetch(`/api/jobs/${params.id}`, { headers: { Authorization: 'Bearer test-token' } });
  const job = await res.json();
  return (
    <main>
      <h1>{job.title}</h1>
      <pre>{JSON.stringify(job, null, 2)}</pre>
    </main>
  );
}
