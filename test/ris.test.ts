import { test } from 'vitest';
import { parseRIS } from '../src/index.js';
import { compareTestRefs } from './data/blue-light.js';
import { readFile } from 'fs/promises';

test('should parse a RIS file', async () => {
  const content = await readFile('test/data/blue-light.ris', 'utf-8');
  const refs = await parseRIS(content);
  await compareTestRefs(refs, { profile: 'ris' });
});
