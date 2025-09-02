import { Hono } from 'hono';
import { bearerAuth } from 'hono/bearer-auth';
import { z } from 'zod';

/**
 * Interface describing environment bindings provided by the Workers runtime.
 */
export interface Env {
  /** Workers AI binding used to run language models for document generation. */
  AI: { run: (model: string, inputs: Record<string, unknown>) => Promise<unknown> };
  /** Static token used for bearer authentication. */
  API_AUTH_TOKEN: string;
}

/**
 * Zod schema describing the expected request body for cover letter generation.
 */
const CoverLetterRequestSchema = z.object({
  job_title: z.string(),
  company_name: z.string(),
  hiring_manager_name: z.string().optional(),
  job_description_text: z.string(),
  candidate_career_summary: z.string(),
});

type CoverLetterRequestBody = z.infer<typeof CoverLetterRequestSchema>;

/**
 * Zod schema describing the expected request body for resume generation.
 */
const ResumeRequestSchema = z.object({
  candidate_name: z.string(),
  job_description_text: z.string(),
  candidate_career_summary: z.string(),
  candidate_experience: z.string(),
  candidate_skills: z.string(),
});

type ResumeRequestBody = z.infer<typeof ResumeRequestSchema>;

/**
 * Generates a tailored cover letter using Workers AI based on the provided request body.
 *
 * @param env - The Worker environment containing the AI binding.
 * @param body - Validated request data describing the job and candidate.
 * @returns Structured cover letter content where each field represents a paragraph.
 */
async function generateCoverLetter(env: Env, body: CoverLetterRequestBody): Promise<Record<string, string>> {
  const coverLetterSchema = {
    type: 'object',
    properties: {
      salutation: { type: 'string' },
      opening_paragraph: { type: 'string' },
      body_paragraph_1: { type: 'string' },
      body_paragraph_2: { type: 'string' },
      closing_paragraph: { type: 'string' },
    },
    required: ['salutation', 'opening_paragraph', 'body_paragraph_1', 'body_paragraph_2', 'closing_paragraph'],
  };

  const messages = [
    {
      role: 'system',
      content: 'You are an expert career coach. Produce a cover letter following the supplied JSON schema.',
    },
    {
      role: 'user',
      content: `Job Title: ${body.job_title}\nCompany: ${body.company_name}\nHiring Manager: ${body.hiring_manager_name ?? 'Not specified'}\n--- Job Description ---\n${body.job_description_text}\n--- Candidate Summary ---\n${body.candidate_career_summary}`,
    },
  ];

  const inputs = { messages, guided_json: coverLetterSchema };
  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', inputs);
  return response as Record<string, string>;
}

/**
 * Generates a concise resume summary using Workers AI based on the provided request body.
 *
 * @param env - The Worker environment containing the AI binding.
 * @param body - Validated request data describing the candidate and target role.
 * @returns Structured resume content with core sections such as name, summary, experience, and skills.
 */
async function generateResume(env: Env, body: ResumeRequestBody): Promise<Record<string, string>> {
  const resumeSchema = {
    type: 'object',
    properties: {
      name: { type: 'string' },
      summary: { type: 'string' },
      experience: { type: 'string' },
      skills: { type: 'string' },
    },
    required: ['name', 'summary', 'experience', 'skills'],
  };

  const messages = [
    { role: 'system', content: 'You are a helpful assistant that crafts professional resume snippets.' },
    {
      role: 'user',
      content: `Name: ${body.candidate_name}\n--- Job Description ---\n${body.job_description_text}\n--- Candidate Summary ---\n${body.candidate_career_summary}\n--- Experience ---\n${body.candidate_experience}\n--- Skills ---\n${body.candidate_skills}`,
    },
  ];

  const inputs = { messages, guided_json: resumeSchema };
  const response = await env.AI.run('@cf/meta/llama-3.1-8b-instruct', inputs);
  return response as Record<string, string>;
}

const app = new Hono<{ Bindings: Env }>();

// Apply bearer authentication to all API routes.
app.use('/api/*', (c, next) => bearerAuth({ token: c.env.API_AUTH_TOKEN })(c, next));

/**
 * Health check endpoint used by monitoring systems.
 */
app.get('/api/health', (c) => c.json({ status: 'ok' }));

/**
 * POST /api/cover-letter
 * Validates the incoming payload, invokes Workers AI, and returns the structured cover letter.
 */
app.post('/api/cover-letter', async (c) => {
  const parsed = CoverLetterRequestSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: 'Invalid request', details: parsed.error.issues }, 400);
  }
  const content = await generateCoverLetter(c.env, parsed.data);
  return c.json(content);
});

/**
 * POST /api/resume
 * Validates the incoming payload, invokes Workers AI, and returns the structured resume.
 */
app.post('/api/resume', async (c) => {
  const parsed = ResumeRequestSchema.safeParse(await c.req.json());
  if (!parsed.success) {
    return c.json({ error: 'Invalid request', details: parsed.error.issues }, 400);
  }
  const content = await generateResume(c.env, parsed.data);
  return c.json(content);
});

export default app;
