import { Hono } from 'hono';
import { z } from 'zod';
import { Env } from '../index.js';

const app = new Hono<{ Bindings: Env }>();

app.get('/jobs/:id', async (c) => {
  const id = c.req.param('id');
  const res = await c.env.DB.prepare('SELECT * FROM jobs WHERE id=?').bind(id).first();
  if (!res) return c.notFound();
  return c.json(res);
});

const CreateSchema = z.object({ url: z.string().url(), siteId: z.string().optional() });

app.post('/job', async (c) => {
  const body = await c.req.json();
  const parsed = CreateSchema.parse(body);
  const id = crypto.randomUUID();
  await c.env.DB.prepare('INSERT INTO jobs(id,url,site_id,status) VALUES(?1,?2,?3,?4)')
    .bind(id, parsed.url, parsed.siteId, 'open')
    .run();
  return c.json({ id });
});

export default app;
