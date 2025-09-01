import { Hono } from 'hono';
import type { Env } from '../index.js';

const app = new Hono<{ Bindings: Env }>();

app.post('/webhooks/test', async (c) => {
  if (!c.env.SLACK_WEBHOOK_URL) return c.json({ ok: false });
  await fetch(c.env.SLACK_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ text: 'Test message' })
  });
  return c.json({ ok: true });
});

export default app;
