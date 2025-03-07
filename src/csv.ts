import { parse } from 'csv-parse';
import type { BibLibRef } from './types/index.js';
import { translations } from './translations/csv.js';
import { mutators } from './utils/mutators.js';

interface CSVOptions {
  defaultType?: string;
}

export async function parseCSV(
  fileContent: string,
  options?: CSVOptions,
): Promise<BibLibRef[]> {
  const settings: Required<CSVOptions> = {
    defaultType: 'journalArticle',
    ...options,
  };

  initializeTranslationMaps();

  return new Promise((resolve, reject) => {
    const refs: BibLibRef[] = [];

    parse(
      fileContent,
      {
        columns: (header) => {
          return header.map((h: string) => h?.toLowerCase());
        },
        skip_empty_lines: true,
      },
      (err, records) => {
        if (err) {
          return reject(err);
        }

        for (const row of records) {
          const ref = parseRow(row, settings);
          if (Object.keys(ref).length > 0) {
            refs.push(ref);
          }
        }

        resolve(refs);
      },
    );
  });
}

function parseRow(row: any, settings: Required<CSVOptions>): BibLibRef {
  const ref: BibLibRef = {};

  // Set default type if specified
  if (settings.defaultType) {
    ref.type = settings.defaultType;
  }

  // Process each field in the row
  for (let [key, value] of Object.entries(row) as [string, string][]) {
    const fieldLookup = translations.fields.rawMap.get(key);
    if (!fieldLookup || !value) continue;

    if (fieldLookup.inputArray) {
      // Handle array fields (prioritize semicolon, fallback to comma)
      const values = value.includes(';')
        ? value.split(/;\s*/)
        : value.split(/,\s*/);
      ref[fieldLookup.bl] = values.filter((v) => v.trim());
    } else {
      // Handle single value fields
      ref[fieldLookup.bl] = value.trim();
    }
  }

  if (ref.doi) {
    ref.doi = mutators.doiRewrite.handler(ref.doi, ref);
  }

  if (ref.authors) {
    ref.authors = ref.authors.map(mutators.authorRewrite.handler);
  }

  return ref;
}

function initializeTranslationMaps() {
  // Initialize fields maps
  translations.fields.rawMap.clear();
  translations.fields.blMap.clear();
  for (const field of translations.fields.collection) {
    translations.fields.rawMap.set(field.raw, field);
    translations.fields.blMap.set(field.bl, field);
  }
}
