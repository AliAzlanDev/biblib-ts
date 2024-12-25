import * as XMLParser from 'htmlparser2';
import { translations } from './translations/endnote-xml.js';
import type { BibLibRef } from './types/index.js';
import camelCase from './utils/camel-case.js';
import { mutators } from './utils/mutators.js';

interface EndnoteXMLOptions {
  defaultType?: string;
}

interface RawEndnoteRef {
  [key: string]: any;
  recNumber?: string;
  refType?: number;
  title?: string;
  authors?: string[];
  keywords?: string[];
  gParentName?: string;
}

/**
 * Parse EndNote XML content and return references
 * @param content EndNote XML content as string
 * @param options Parsing options
 * @returns Array of parsed references
 */
export async function parseEndnoteXML(
  content: string,
  options: EndnoteXMLOptions = {},
): Promise<BibLibRef[]> {
  const settings = {
    defaultType: 'journalArticle',
    ...options,
  };

  initializeTranslationMaps();

  const refs: BibLibRef[] = [];
  let currentRef: RawEndnoteRef = {};
  let stack: { name: string; attrs: { [key: string]: string } }[] = [];
  let textAppend = false;

  const parser = new XMLParser.Parser(
    {
      onopentag(name, attrs) {
        textAppend = false;
        stack.push({
          name: camelCase(name),
          attrs,
        });
      },

      onclosetag(name) {
        if (name === 'record') {
          if (currentRef.title) {
            currentRef.title = currentRef.title
              .replace(/^.*<style.*>(.*)<\/style>.*$/m, '$1')
              .replace(/^\s+/, '')
              .replace(/\s+$/, '');
          }
          refs.push(translateRawToRef(currentRef));
          stack = [];
          currentRef = {};
        } else {
          stack.pop();
        }
      },

      ontext(text) {
        const parentName = stack[stack.length - 1]?.name;
        const gParentName = stack[stack.length - 2]?.name;

        if (parentName === 'title') {
          if (textAppend) {
            currentRef.title += text;
          } else {
            currentRef.title = text;
          }
        } else if (parentName === 'style' && gParentName === 'author') {
          if (!currentRef.authors) currentRef.authors = [];
          if (textAppend) {
            currentRef.authors[currentRef.authors.length - 1] +=
              xmlUnescape(text);
          } else {
            currentRef.authors.push(xmlUnescape(text));
          }
        } else if (parentName === 'style' && gParentName === 'keyword') {
          if (!currentRef.keywords) currentRef.keywords = [];
          if (textAppend) {
            currentRef.keywords[currentRef.keywords.length - 1] +=
              xmlUnescape(text);
          } else {
            currentRef.keywords.push(xmlUnescape(text));
          }
        } else if (parentName === 'style' && gParentName) {
          if (textAppend || currentRef[gParentName]) {
            currentRef[gParentName] += xmlUnescape(text);
          } else {
            currentRef[gParentName] = xmlUnescape(text);
          }
        } else if (['recNumber', 'refType'].includes(parentName || '')) {
          if (textAppend || currentRef[parentName!]) {
            currentRef[parentName!] += xmlUnescape(text);
          } else {
            currentRef[parentName!] = xmlUnescape(text);
          }
        }
        textAppend = true;
      },
    },
    { xmlMode: true, decodeEntities: false },
  );

  parser.write(content);
  parser.end();
  refs.forEach((ref) => {
    if (ref.authors) {
      ref.authors = ref.authors.map(mutators.authorRewrite.handler);
    }
  });

  return refs;
}

function xmlUnescape(str: string): string {
  return ('' + str)
    .replace(/&amp;/g, '&')
    .replace(/&#xD;/g, '\r')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

function translateRawToRef(xRef: RawEndnoteRef): BibLibRef {
  const recOut: BibLibRef = {
    ...Object.fromEntries(
      translations.fields.collection
        .filter((field) => xRef[field.raw])
        .map((field) => {
          const value = xRef[field.raw];
          // Add doi.org prefix if it's a DOI field and doesn't already have it
          if (field.bl === 'doi' && typeof value === 'string') {
            return [field.bl, mutators.doiRewrite.handler(value)];
          }
          if (field.bl === 'pages') {
            return [field.bl, mutators.consistentPageNumbering.handler(value)];
          }
          return [field.bl, value];
        }),
    ),
    type:
      translations.types.rawMap.get(+(xRef.refType || 17))?.bl ||
      'journalArticle',
  };

  return recOut;
}

function initializeTranslationMaps() {
  // Initialize types maps
  translations.types.rawMap.clear();
  translations.types.blMap.clear();
  for (const type of translations.types.collection) {
    if (type.rawId) {
      translations.types.rawMap.set(type.rawId, type);
    }
    translations.types.blMap.set(type.bl, type);
  }
}
