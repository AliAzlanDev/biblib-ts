import type { BibLibRef } from './types/index.js';
import bibtexParse from 'bibtex-parse';
import { mutators } from './utils/mutators.js';
import { convertLatexMath } from './utils/latex.js';

interface BibTeXOptions {
  removeComments?: boolean;
  defaultType?: string;
  delimeter?: string;
}

function cleanText(text: string): string {
  // First convert LaTeX math expressions
  text = convertLatexMath(text);
  // Then clean whitespace
  return text.replace(/\s+/g, ' ').trim();
}

function getMonthNumber(month: string): number | null {
  if (!month) return null;
  // Try direct number
  const num = parseInt(month);
  if (!isNaN(num) && num >= 1 && num <= 12) return num;
  // Try month name
  const monthLower = month.toLowerCase();
  const monthEntry = Object.entries(months).find(([_, name]) =>
    name.toLowerCase().startsWith(monthLower),
  );
  return monthEntry ? parseInt(monthEntry[0]) : null;
}

function transformToBibLibRef(bibEntry: any): BibLibRef {
  const ref: BibLibRef = {
    type: bibEntry.type === 'article' ? 'journalArticle' : bibEntry.type,
  };

  // Map BibTeX fields to BibLibRef fields
  if (bibEntry.TITLE) ref.title = cleanText(bibEntry.TITLE);
  if (bibEntry.JOURNAL) ref.journal = cleanText(bibEntry.JOURNAL);
  if (bibEntry.AUTHOR) ref.authors = [cleanText(bibEntry.AUTHOR)];

  // Handle date with year and month
  if (bibEntry.YEAR) {
    const year = bibEntry.YEAR;
    ref.year = `${year}`;
    if (bibEntry.MONTH) {
      const monthNum = getMonthNumber(bibEntry.MONTH);
      if (monthNum) {
        const month = months[monthNum as keyof typeof months];
        if (bibEntry.DAY) {
          ref.date = `${bibEntry.DAY.toString().padStart(2, '0')} ${month} ${year}`;
        } else {
          ref.date = `${month} ${year}`;
        }
      } else {
        ref.date = `${year}`;
      }
    } else {
      ref.date = `${year}`;
    }
  }

  if (bibEntry.URL) ref.urls = [bibEntry.URL];
  if (bibEntry.PAGES)
    ref.pages = mutators.consistentPageNumbering.handler(bibEntry.PAGES);
  if (bibEntry.VOLUME) ref.volume = `${bibEntry.VOLUME}`;
  if (bibEntry.NUMBER) ref.number = `${bibEntry.NUMBER}`;
  if (bibEntry.ISBN) ref.isbn = `${bibEntry.ISBN}`;
  if (bibEntry.ABSTRACT) ref.abstract = cleanText(bibEntry.ABSTRACT);
  if (bibEntry.LANGUAGE) ref.language = bibEntry.LANGUAGE;
  if (bibEntry.KEYWORDS) {
    ref.keywords = bibEntry.KEYWORDS.split(/\s*;\s*/)
      .map((k: string) => k.trim())
      .filter((k: string) => k);
  }
  if (bibEntry.DOI) ref.doi = mutators.doiRewrite.handler(bibEntry.DOI, ref);
  if (bibEntry.PUBLISHER) ref.databaseProvider = cleanText(bibEntry.PUBLISHER);
  if (bibEntry.NOTE) ref.notes = cleanText(bibEntry.NOTE);
  // Store the original BibTeX key
  ref.label = bibEntry.key;

  return ref;
}

/**
 * Parse a BibTeX string and return reference data
 * @param fileContent BibTeX file content
 * @param options Parsing options
 * @returns Promise resolving to parsed references
 */
export async function parseBibTeX(
  fileContent: string,
  options?: BibTeXOptions,
): Promise<BibLibRef[]> {
  const settings: Required<BibTeXOptions> = {
    removeComments: true,
    defaultType: 'journalArticle',
    delimeter: '\n',
    ...options,
  };

  const bibEntries = bibtexParse.entries(fileContent);
  return bibEntries.map((entry: any) => transformToBibLibRef(entry));
}

const months = {
  1: 'January',
  2: 'February',
  3: 'March',
  4: 'April',
  5: 'May',
  6: 'June',
  7: 'July',
  8: 'August',
  9: 'September',
  10: 'October',
  11: 'November',
  12: 'December',
};
