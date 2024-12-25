import { test } from 'vitest';
import { parseMedline } from '../src/index.js';
import { compareTestRefs } from './data/blue-light.js';
import { readFile } from 'fs/promises';

test('should parse the Medline content', async () => {
  const content = await readFile('test/data/blue-light.nbib', 'utf-8');
  const refs = await parseMedline(content, { journal: 'short' });

  await compareTestRefs(refs, { profile: 'medline' });
});
