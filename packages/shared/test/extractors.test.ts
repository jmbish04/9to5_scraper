import { describe, expect, it } from 'vitest';
import { parseSalary, normalizeComp } from '../src/extractors.js';

describe('salary parsing', () => {
  it('parses simple range', () => {
    const info = parseSalary('$100k - $120k');
    const norm = normalizeComp(info);
    expect(norm.min).toBeGreaterThan(0);
  });
});
