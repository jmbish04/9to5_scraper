import { describe, it, expect } from 'vitest';
import app from '../src/index.js';
import { Hono } from 'hono';

function makeEnv() {
  return {
    DB: { prepare: () => ({ bind: () => ({ all: async () => ({ results: [] }), first: async () => null, run: async () => {} }) }) } as any,
    KV: { get: async () => null, put: async () => {} } as any,
    R2: {} as any,
    AI: { run: async () => ({}) },
    VECTORIZE_INDEX: { query: async () => ({ matches: [] }), upsert: async () => {} } as any,
    API_AUTH_TOKEN: 'test',
    BROWSER_RENDERING_TOKEN: '',
    SLACK_WEBHOOK_URL: ''
  };
}

describe('worker routes', () => {
  it('health endpoint works', async () => {
    const req = new Request('http://x/api/health', { headers: { Authorization: 'Bearer test' } });
    const res = await app.fetch(req, makeEnv());
    expect(res.status).toBe(200);
  });
});
