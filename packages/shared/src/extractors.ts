import { YEARLY_HOURS, DEFAULT_CURRENCY } from './constants.js';
import { cleanText } from './normalize.js';

export interface SalaryInfo {
  min?: number;
  max?: number;
  currency?: string;
  raw?: string;
}

// very naive salary parser
export function parseSalary(input: string): SalaryInfo {
  const text = cleanText(input);
  const match = text.match(/([$€£])\s*(\d+[\d,\.]*)(?:\s*[-–]\s*(\d+[\d,\.]*))?/i);
  if (!match) return { raw: input };
  const currency = match[1] === '$' ? 'USD' : match[1] === '€' ? 'EUR' : 'GBP';
  const min = Number(match[2].replace(/[,\.]/g, ''));
  const max = match[3] ? Number(match[3].replace(/[,\.]/g, '')) : min;
  return { min, max, currency, raw: input };
}

export function normalizeComp(salary: SalaryInfo, period: 'hour' | 'day' | 'year' = 'year'): SalaryInfo {
  if (!salary.min || !salary.max) return salary;
  let factor = 1;
  if (period === 'hour') factor = YEARLY_HOURS;
  if (period === 'day') factor = 260; // 5 days * 52 weeks
  return {
    ...salary,
    min: Math.round(salary.min * factor),
    max: Math.round(salary.max * factor),
    currency: salary.currency || DEFAULT_CURRENCY,
  };
}
