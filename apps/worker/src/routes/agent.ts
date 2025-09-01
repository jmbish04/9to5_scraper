import { Context } from 'hono';
import { Env } from '../index.js';
import { embedText } from '@job-scraper/cf-ai';

export const queryAgent = async (c: Context<{ Bindings: Env }>) => {
  const q = c.req.query('q') || '';
  const embedding = await embedText(c.env, q);
  if (!embedding) return c.json({ results: [] });
  const vectorRes = await c.env.VECTORIZE_INDEX.query(embedding, { topK: 3 });
  const ids = vectorRes.matches?.map((m: any) => m.id) || [];
  const rows = await c.env.DB.prepare(`SELECT * FROM jobs WHERE id IN (${ids.map(() => '?').join(',')})`).bind(...ids).all();
  return c.json({ results: rows.results });
};
