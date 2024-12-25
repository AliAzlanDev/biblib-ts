import { test } from 'vitest';
import { parseBibTeX } from '../src/index.js';
import { readFile } from 'fs/promises';
import { compareTestRefs } from './data/blue-light.js';

test('should parse a BibTex file', async () => {
  const content = await readFile('test/data/blue-light.bib', 'utf-8');
  const refs = await parseBibTeX(content);

  await compareTestRefs(refs, { profile: 'bibtex' });
});
