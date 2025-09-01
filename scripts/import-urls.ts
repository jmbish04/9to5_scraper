import fs from 'node:fs';
import csv from 'node:csv-parse/sync';

const file = process.argv[2];
if (!file) throw new Error('CSV file required');
const content = fs.readFileSync(file, 'utf-8');
const records = csv.parse(content, { columns: true });
console.log('Importing', records.length, 'urls');
