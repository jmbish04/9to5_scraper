import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { bearerAuth } from 'hono/bearer-auth';
import type { D1Database, KVNamespace, R2Bucket, Vectorize } from '@cloudflare/workers-types';
import jobs from './routes/jobs.js';
import job from './routes/job.js';
import runs from './routes/runs.js';
import configs from './routes/configs.js';
import webhooks from './routes/webhooks.js';
import { queryAgent } from './routes/agent.js';

export interface Env {
  DB: D1Database;
  KV: KVNamespace;
  R2: R2Bucket;
  AI: any;
  VECTORIZE_INDEX: Vectorize;
  API_AUTH_TOKEN: string;
  BROWSER_RENDERING_TOKEN: string;
  SLACK_WEBHOOK_URL: string;
}

const app = new Hono<{ Bindings: Env }>();
app.use('*', cors());
app.use('/api/*', (c, next) => bearerAuth({ token: c.env.API_AUTH_TOKEN })(c, next));

app.route('/api', jobs);
app.route('/api', job);
app.route('/api', runs);
app.route('/api', configs);
app.route('/api', webhooks);
app.get('/api/agent/query', queryAgent);

app.get('/api/health', (c) => c.text('ok'));

export default app;
