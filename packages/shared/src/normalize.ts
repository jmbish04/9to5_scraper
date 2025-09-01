import crypto from 'node:crypto';
import { HASH_ALGO } from './constants.js';

export function canonicalUrl(url: string): string {
  try {
    const u = new URL(url);
    u.hash = '';
    u.searchParams.sort();
    return u.toString();
  } catch {
    return url;
  }
}

export function cleanText(text: string): string {
  return text.replace(/\s+/g, ' ').trim();
}

export function hashContent(content: string): string {
  return crypto.createHash(HASH_ALGO).update(content).digest('hex');
}
