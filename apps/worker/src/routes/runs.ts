import { Hono } from 'hono';
import { Env } from '../index.js';

const app = new Hono<{ Bindings: Env }>();

app.post('/runs/discovery', async (c) => {
  const id = crypto.randomUUID();
  await c.env.DB.prepare('INSERT INTO runs(id,type,status) VALUES(?1,?2,?3)')
    .bind(id, 'discovery', 'queued').run();
  return c.json({ id });
});

app.post('/runs/monitor', async (c) => {
  const id = crypto.randomUUID();
  await c.env.DB.prepare('INSERT INTO runs(id,type,status) VALUES(?1,?2,?3)')
    .bind(id, 'monitor', 'queued').run();
  return c.json({ id });
});

app.get('/runs', async (c) => {
  const res = await c.env.DB.prepare('SELECT * FROM runs ORDER BY started_at DESC LIMIT 20').all();
  return c.json(res.results);
});

export default app;
