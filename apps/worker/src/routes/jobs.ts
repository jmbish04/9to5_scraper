import { Hono } from 'hono';
import type { Env } from '../index.js';

const app = new Hono<{ Bindings: Env }>();

app.get('/jobs', async (c) => {
  const status = c.req.query('status');
  const stmt = c.env.DB.prepare('SELECT * FROM jobs WHERE (?1 IS NULL OR status=?1) LIMIT 50');
  const res = await stmt.bind(status).all();
  return c.json(res.results);
});

export default app;
