import { translations } from './translations/ris.js';
import type { TransField, BibLibRef } from './types/index.js';
import { mutators } from './utils/mutators.js';

interface RISOptions {
  defaultType?: string;
  delimeter?: string;
}

/**
 * Parse a RIS file and return an array of references
 * @param filePath Path to the .ris file
 * @param options RIS parsing options
 * @returns Promise resolving to an array of parsed references
 */
export async function parseRIS(
  fileContent: string,
  options?: RISOptions,
): Promise<BibLibRef[]> {
  initializeTranslationMaps(); // Add this line at the start
  const settings: Required<RISOptions> = {
    defaultType: 'journalArticle',
    delimeter: '\r',
    ...options,
  };

  const refs: BibLibRef[] = [];

  // Split file content by ER marker and filter empty entries
  const refStrings = fileContent
    .split(/(\r\n|\n)ER\s+-\s*(\r\n|\n)/)
    .filter((str) => str.trim() && !str.match(/^(\r\n|\n)$/));

  // Parse each reference string
  for (const refString of refStrings) {
    const ref = parseRef(refString, settings);
    if (Object.keys(ref).length > 0) {
      refs.push(ref);
    }
  }

  return refs;
}

function parseRef(
  refString: string,
  settings: Required<RISOptions>,
): BibLibRef {
  const ref: BibLibRef = {};
  let lastField: TransField | null = null;

  refString
    .split(/[\r\n|\n]/) // Split into lines
    .forEach((line) => {
      let parsedLine = /^\s*(?<key>[A-Z0-9]+?)\s+-\s+(?<value>.*)$/s.exec(
        line,
      )?.groups;

      if (!parsedLine || !parsedLine.value) {
        // Added check for parsedLine.value
        if (line.replace(/\s+/, '') && lastField) {
          // Line isn't just whitespace + We have a field to append to - append with \r delimiters
          if (lastField.inputArray) {
            const currentValue = ref[lastField.bl];
            if (Array.isArray(currentValue)) {
              currentValue.push(line);
            } else {
              ref[lastField.bl] = [line];
            }
          } else {
            const currentValue = ref[lastField.bl];
            if (typeof currentValue === 'string') {
              ref[lastField.bl] = currentValue + settings.delimeter + line;
            } else {
              ref[lastField.bl] = line;
            }
          }
        }
        return; // Stop processing this line
      }

      if (parsedLine.key == 'ER') return; // Skip 'ER' defiition lines - this is probably due to the buffer draining
      let fieldLookup = parsedLine.key
        ? translations.fields.rawMap.get(parsedLine.key)
        : undefined;
      if (!fieldLookup) {
        // Skip unknown field translations
        lastField = null;
        return;
      } else if (fieldLookup.bl == 'type') {
        // Special handling for ref types
        ref[fieldLookup.bl] =
          (parsedLine.value
            ? translations.types.rawMap.get(parsedLine.value)?.bl
            : undefined) || settings.defaultType;
        lastField = fieldLookup; // Track last key so we can append to it on the next cycle
      } else if (fieldLookup.inputArray) {
        const currentValue = ref[fieldLookup.bl];
        if (Array.isArray(currentValue)) {
          currentValue.push(parsedLine.value);
        } else {
          ref[fieldLookup.bl] = [parsedLine.value];
        }
        lastField = fieldLookup;
      } else {
        // Simple key=val
        ref[fieldLookup.bl] = parsedLine.value;
        lastField = fieldLookup;
      }
    });

  // Post processing
  // Page mangling {{{
  if (ref._pageStart || ref._pageEnd) {
    ref.pages = mutators.consistentPageNumbering.handler(
      [ref._pageStart, ref._pageEnd]
        .filter(Boolean) // Remove duds
        .join('-'),
    );
    delete ref._pageStart;
    delete ref._pageEnd;
  }
  if (ref.doi) {
    ref.doi = mutators.doiRewrite.handler(ref.doi, ref);
  }
  if (ref.authors) {
    ref.authors = ref.authors.map(mutators.authorRewrite.handler);
  }
  // }}}

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

  // Initialize types maps
  translations.types.rawMap.clear();
  translations.types.blMap.clear();
  for (const type of translations.types.collection) {
    if (type.raw) {
      translations.types.rawMap.set(type.raw, type);
    }
    translations.types.blMap.set(type.bl, type);
  }
}
