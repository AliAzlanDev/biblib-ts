import type { TransField } from '../types/index.js';

interface Translations {
  fields: {
    collection: TransField[];
    collectionOutput: TransField[];
    rawMap: Map<string, TransField>;
    blMap: Map<string, TransField>;
  };
}

// according to CSVs downloaded from PubMed and Cochrane, the following fields are present:
export const translations: Translations = {
  fields: {
    collection: [
      { bl: 'medlinePMID', raw: 'pmid' },
      { bl: 'title', raw: 'title', trimDotSuffix: true },
      { bl: 'abstract', raw: 'abstract' },
      {
        bl: 'authors',
        raw: 'authors',
        outputRepeat: true,
        inputArray: true,
      },
      {
        bl: 'authors',
        raw: 'author(s)',
        outputRepeat: true,
        inputArray: true,
      },
      { bl: 'journal', raw: 'journal/book' },
      { bl: 'journal', raw: 'journal' },
      { bl: 'year', raw: 'publication year' },
      { bl: 'year', raw: 'year' },
      { bl: 'medlinePubMedCentralID', raw: 'pmcid' },
      { bl: 'doi', raw: 'doi' },
      { bl: 'keywords', raw: 'keywords', outputRepeat: true, inputArray: true },
      { bl: 'urls', raw: 'url', sort: false, inputArray: true },
      { bl: 'isbn', raw: 'isbn' },
      { bl: 'isbn', raw: 'issn' },
      { bl: 'database', raw: 'source' },
      { bl: 'databaseProvider', raw: 'publisher' },
      { bl: 'volume', raw: 'volume' },
      { bl: 'number', raw: 'issue' },
    ],
    collectionOutput: [],
    rawMap: new Map(),
    blMap: new Map(),
  },
};
