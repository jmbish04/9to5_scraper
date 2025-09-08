import { describe, it, expect } from 'vitest';
import app, { Env } from '../src/index';

/**
 * Creates a minimal Env object for testing, allowing injection of a custom AI.run implementation.
 */
function makeEnv(aiRun?: (model: string, inputs: Record<string, unknown>) => Promise<any>): Env {
  return {
    AI: { run: aiRun || (async () => ({})) },
    API_AUTH_TOKEN: 'test'
  };
}

describe('document generation worker', () => {
  it('health endpoint works', async () => {
    const req = new Request('http://x/api/health', { headers: { Authorization: 'Bearer test' } });
    const res = await app.fetch(req, makeEnv());
    expect(res.status).toBe(200);
  });

  it('cover letter endpoint returns JSON', async () => {
    const req = new Request('http://x/api/cover-letter', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test' },
      body: JSON.stringify({
        job_title: 'Engineer',
        company_name: 'Acme',
        job_description_text: 'Build stuff',
        candidate_career_summary: 'Experienced developer'
      })
    });

    const res = await app.fetch(req, makeEnv(async () => ({
      salutation: 'Dear Hiring Manager,',
      opening_paragraph: 'I am excited to apply.',
      body_paragraph_1: 'Experience details.',
      body_paragraph_2: 'More skills.',
      closing_paragraph: 'Thank you.'
    })));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.salutation).toBe('Dear Hiring Manager,');
  });

  it('resume endpoint returns JSON', async () => {
    const req = new Request('http://x/api/resume', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: 'Bearer test' },
      body: JSON.stringify({
        candidate_name: 'Alice',
        job_description_text: 'Engineer role',
        candidate_career_summary: 'Skilled developer',
        candidate_experience: 'Built things',
        candidate_skills: 'JS, TS'
      })
    });

    const res = await app.fetch(req, makeEnv(async () => ({
      name: 'Alice',
      summary: 'Summary',
      experience: 'Experience',
      skills: 'Skills'
    })));

    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.name).toBe('Alice');
  });
});
