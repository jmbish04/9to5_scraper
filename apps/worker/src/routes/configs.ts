import { Hono } from 'hono';
import { z } from 'zod';
import type { Env } from '../index.js';

const app = new Hono<{ Bindings: Env }>();

const ConfigSchema = z.object({ name: z.string(), keywords: z.array(z.string()) });

app.get('/configs', async (c) => {
  const res = await c.env.DB.prepare('SELECT * FROM search_configs').all();
  return c.json(res.results);
});

app.post('/configs', async (c) => {
  const body = await c.req.json();
  const parsed = ConfigSchema.parse(body);
  const id = crypto.randomUUID();
  await c.env.DB.prepare('INSERT INTO search_configs(id,name,keywords) VALUES(?1,?2,?3)')
    .bind(id, parsed.name, JSON.stringify(parsed.keywords)).run();
  return c.json({ id });
});

export default app;
