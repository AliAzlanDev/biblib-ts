import { translations } from './translations/medline.js';
import type { TransField, BibLibRef } from './types/index.js';
import { mutators } from './utils/mutators.js';

interface MedlineOptions {
  defaultType?: string;
  delimeter?: string;
  reformatAuthors?: boolean;
  journal?: string;
  parseAddress?: boolean;
  parseDoi?: boolean;
  parseYear?: boolean;
  fieldsReplace?: FieldReplace[];
}

interface FieldReplace {
  from?: string;
  to: string;
  delete?: boolean;
  reformat?: (value: any, ref: BibLibRef) => any;
}

export async function parseMedline(
  content: string,
  options?: MedlineOptions,
): Promise<BibLibRef[]> {
  const settings: Required<MedlineOptions> = {
    defaultType: 'journalArticle',
    delimeter: '\r',
    reformatAuthors: true,
    journal: 'long',
    parseAddress: true,
    parseDoi: true,
    parseYear: true,
    fieldsReplace: [],
    ...options,
  };

  // Translate type
  settings.fieldsReplace.push({
    from: 'type',
    to: 'type',
    delete: false,
    reformat: (v) => {
      const translation = translations.types.rawMap.get(String(v));
      return translation?.bl || settings.defaultType;
    },
  });

  // Settings parsing
  if (settings.reformatAuthors) {
    settings.fieldsReplace.push({
      to: 'authors',
      reformat: (authors: any, ref: BibLibRef) =>
        (ref.medlineAuthorsShort || ref.medlineAuthorsFull || []).map(
          mutators.authorRewrite.handler,
        ),
    });
  }

  // Add rule for where the journal field comes from
  settings.fieldsReplace.push({
    to: 'journal',
    reformat:
      settings.journal === 'long'
        ? (v, ref) => ref.medlineJournalFull || ref.medlineJournalShort
        : (v, ref) => ref.medlineJournalShort || ref.medlineJournalLong,
  });

  // Allow parsing of Address
  if (settings.parseAddress)
    settings.fieldsReplace.push({
      from: 'medlineAuthorsAffiliation',
      to: 'address',
      delete: false,
      reformat: (v) => {
        if (!v) return false;
        return v.join(settings.delimeter);
      },
    });

  // Allow parsing of DOIs
  if (settings.parseDoi)
    settings.fieldsReplace.push({
      from: 'medlineArticleID',
      to: 'doi',
      delete: false,
      reformat: (v, ref) => mutators.doiRewrite.handler(v, ref) ?? false,
    });

  // Allow parsing of years
  if (settings.parseYear)
    settings.fieldsReplace.push({
      from: 'date',
      to: 'year',
      delete: false,
      reformat: (v) => /(?<year>\d{4}\b)/.exec(v)?.groups?.year ?? false,
    });

  // Initialize maps for field and type translations
  initializeTranslationMaps();

  // Split content into individual references
  const refs = content
    .split(/(\r\n|\n){2,}/)
    .filter((block) => block.trim())
    .map((block) => parseRef(block, settings));

  return refs;
}

export function parseRef(
  refString: string,
  settings: Required<MedlineOptions>,
): BibLibRef {
  const ref: BibLibRef = {};
  let lastField: TransField | null = null;

  refString.split(/[\r\n|\n]/).forEach((line: string) => {
    let parsedLine = /^\s*(?<key>[A-Z]+?)\s*-\s+(?<value>.*)$/s.exec(
      line,
    )?.groups;

    if (!parsedLine || !parsedLine.value) {
      // Doesn't match key=val spec
      line = line.trimStart();
      if (line.replace(/\s+/, '') && lastField) {
        // Line isn't just whitespace + We have a field to append to - append with \r delimiters
        if (lastField.inputArray) {
          // Treat each line feed like an array entry
          const currentValue = ref[lastField.bl];
          if (Array.isArray(currentValue)) {
            currentValue.push(line);
          } else {
            ref[lastField.bl] = [line];
          }
        } else {
          // Assume we append each line entry as a single-line string
          ref[lastField.bl] += ' ' + line;
        }
      }
      return; // Stop processing this line
    }

    let fieldLookup = parsedLine.key
      ? translations.fields.rawMap.get(parsedLine.key)
      : undefined;

    if (lastField?.trimDotSuffix) {
      const currentValue = ref[lastField.bl];
      if (typeof currentValue === 'string') {
        ref[lastField.bl] = currentValue.replace(/\.$/, '');
      }
    }

    if (!fieldLookup) {
      // Skip unknown field translations
      lastField = null;
      return;
    } else if (fieldLookup.inputArray) {
      // Should this `rl` key be treated like an appendable array?
      if (!ref[fieldLookup.bl]) {
        // Array doesn't exist yet
        ref[fieldLookup.bl] = [parsedLine.value];
      } else {
        // Append to existing array instead of overwriting
        if (Array.isArray(ref[fieldLookup.bl])) {
          (ref[fieldLookup.bl] as string[]).push(parsedLine.value);
        } else {
          ref[fieldLookup.bl] = [parsedLine.value];
        }
      }
      lastField = fieldLookup;
    } else {
      // Simple key=val
      ref[fieldLookup.bl] = parsedLine.value;
      lastField = fieldLookup;
    }
  });
  if (ref.pages) {
    ref.pages = mutators.consistentPageNumbering.handler(ref.pages);
  }

  // Post processing
  if (settings.fieldsReplace?.length > 0) {
    settings.fieldsReplace.forEach((replacement: FieldReplace) => {
      let newVal: string | string[] | undefined = replacement.from
        ? ref[replacement.from]
        : undefined;

      if (replacement.reformat) {
        const reformatted = replacement.reformat(newVal, ref);
        if (reformatted === false) return;
        newVal = reformatted;
      }

      if (newVal !== undefined) {
        ref[replacement.to] = newVal;
      }

      if (replacement.from && (replacement.delete ?? true)) {
        delete ref[replacement.from];
      }
    });
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

// Export translations object with proper typing
