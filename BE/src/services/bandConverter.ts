import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const tablePath = path.resolve(__dirname, '../config/band-conversion-table.json');
const conversionTable = JSON.parse(fs.readFileSync(tablePath, 'utf8'));

export function getBandScore(skill: 'reading' | 'listening', correctCount: number): number {
  const table = conversionTable[skill];
  const score = table[correctCount.toString()];
  return score !== undefined ? score : 0;
}
