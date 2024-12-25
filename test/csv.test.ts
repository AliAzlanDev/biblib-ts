import { expect, test } from 'vitest';
import { parseCSV } from '../src/index.js';
import { readFile } from 'fs/promises';

test('should parse a CSV file', async () => {
  const content = await readFile('test/data/blue-light.csv', 'utf-8');
  const refs = await parseCSV(content);
  expect(Array.isArray(refs)).toBe(true);
  testRefs.forEach((originalRef) => {
    let computedRef = refs.find((r) => r.title == originalRef.title);

    if (!computedRef) {
      console.warn('Cannot find reference', {
        title: originalRef.title,
      });
      throw new Error('Reference not found');
    }
    expect(typeof computedRef).toBe('object');
    Object.entries(originalRef).forEach(([key, val]) => {
      expect(computedRef).toHaveProperty(key);
      expect(computedRef?.[key]).toEqual(val);
    });
  });
});

const testRefs = [
  {
    title:
      'Effect and safety of intravenous iron compared to oral iron for treatment of iron deficiency anaemia in pregnancy',
    year: '2024',
    abstract:
      'Abstract - Rationale Intravenous iron is increasingly used to treat iron-deficient anaemia (IDA) in pregnancy. A previous network meta-analysis suggested that intravenous irons have a greater effect on haematological parameters than oral irons; however, the impact on serious pregnancy complications such as postpartum haemorrhage (PPH) or the need for blood transfusion was unclear.',
    number: '12',
    databaseProvider: 'John Wiley & Sons, Ltd',
    isbn: '1465-1858',
    doi: 'https://doi.org/10.1002/14651858.CD016136',
    urls: ['http://dx.doi.org/10.1002/14651858.CD016136'],
    database: 'Cochrane Database of Systematic Reviews',
    authors: ['L. Nicholson', 'E. Axon', 'J. Daru'],
  },
  {
    title: 'Chemotherapy and radiotherapy for advanced pancreatic cancer',
    database: 'Cochrane Database of Systematic Reviews',
    year: '2024',
    abstract:
      'Abstract - Background Pancreatic cancer (PC) is a lethal disease with few effective treatment options. Many anti-cancer therapies have been tested in the locally advanced and metastatic setting, with mixed results. This review synthesises all the randomised data available to help better inform patient and clinician decision-making....',
    number: '12',
    databaseProvider: 'John Wiley & Sons, Ltd',
    isbn: '1465-1858',
    keywords: [
      'Albumins [administration & dosage]',
      'Antineoplastic Combined Chemotherapy Protocols [*therapeutic use]',
      'Cisplatin [administration & dosage]',
      'Deoxycytidine [administration & dosage, adverse effects, analogs & derivatives]',
      'Epirubicin [administration & dosage]',
      'Fluorouracil [administration & dosage]',
      'Gemcitabine',
      'Humans',
      'Paclitaxel [administration & dosage]',
      'Pancreatic Neoplasms [*drug therapy, mortality, pathology, radiotherapy]',
      'Pyrimidines [administration & dosage]',
      'Randomized Controlled Trials as Topic',
      'Treatment Outcome',
    ],
    doi: 'https://doi.org/10.1002/14651858.CD011044.pub3',
    urls: ['http://dx.doi.org/10.1002/14651858.CD011044.pub3'],
    authors: [
      'L. Haggstrom',
      'W. Chan',
      'A. Nagrial',
      'L. Chantrill',
      'H. Sim',
      'D. Yip',
      'V. Chin',
    ],
  },
];
