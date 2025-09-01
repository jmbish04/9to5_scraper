import { describe, it, expect } from 'vitest';
import { diffJobs } from '../src/diff.js';

describe('diffJobs', () => {
  it('detects changed field', () => {
    const a = { title: 'A' } as any;
    const b = { title: 'B' } as any;
    const diff = diffJobs(a, b);
    expect(diff[0].field).toBe('title');
  });
});
