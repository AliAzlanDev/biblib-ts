import type { TransField, TransType } from '../types/index.js';

interface Translations {
  fields: {
    collection: TransField[];
  };
  types: {
    collection: TransType[];
    blMap: Map<string, TransType>;
    rawMap: Map<number, TransType>;
  };
}

export const translations: Translations = {
  // Field translations {{{
  fields: {
    collection: [
      { bl: 'recNumber', raw: 'recNumber' },
      { bl: 'title', raw: 'title' },
      { bl: 'journal', raw: 'secondaryTitle' },
      { bl: 'address', raw: 'authAddress' },
      { bl: 'researchNotes', raw: 'researchNotes' },
      { bl: 'type', raw: 'FIXME' },
      { bl: 'authors', raw: 'authors' },
      { bl: 'pages', raw: 'pages' },
      { bl: 'volume', raw: 'volume' },
      { bl: 'number', raw: 'number' },
      { bl: 'isbn', raw: 'isbn' },
      { bl: 'accessionNum', raw: 'accessionNum' },
      { bl: 'abstract', raw: 'abstract' },
      { bl: 'label', raw: 'label' },
      { bl: 'caption', raw: 'caption' },
      { bl: 'notes', raw: 'notes' },
      { bl: 'custom1', raw: 'custom1' },
      { bl: 'custom2', raw: 'custom2' },
      { bl: 'custom3', raw: 'custom3' },
      { bl: 'custom4', raw: 'custom4' },
      { bl: 'custom5', raw: 'custom5' },
      { bl: 'custom6', raw: 'custom6' },
      { bl: 'custom7', raw: 'custom7' },
      { bl: 'doi', raw: 'electronicResourceNum' },
      { bl: 'year', raw: 'year' },
      { bl: 'date', raw: 'date' },
      { bl: 'keywords', raw: 'keywords' },
      { bl: 'urls', raw: 'urls' },
    ],
  },
  // }}}
  // Ref type translations {{{
  types: {
    collection: [
      { bl: 'aggregatedDatabase', rawText: 'Aggregated Database', rawId: 55 },
      { bl: 'ancientText', rawText: 'Ancient Text', rawId: 51 },
      { bl: 'artwork', rawText: 'Artwork', rawId: 2 },
      { bl: 'audioVisualMaterial', rawText: 'Audiovisual Material', rawId: 3 },
      { bl: 'bill', rawText: 'Bill', rawId: 4 },
      { bl: 'blog', rawText: 'Blog', rawId: 56 },
      { bl: 'book', rawText: 'Book', rawId: 6 },
      { bl: 'bookSection', rawText: 'Book Section', rawId: 5 },
      { bl: 'case', rawText: 'Case', rawId: 7 },
      { bl: 'catalog', rawText: 'Catalog', rawId: 8 },
      { bl: 'chartOrTable', rawText: 'Chart or Table', rawId: 38 },
      { bl: 'classicalWork', rawText: 'Classical Work', rawId: 49 },
      { bl: 'computerProgram', rawText: 'Computer Program', rawId: 9 },
      { bl: 'conferencePaper', rawText: 'Conference Paper', rawId: 47 },
      {
        bl: 'conferenceProceedings',
        rawText: 'Conference Proceedings',
        rawId: 10,
      },
      { bl: 'dataset', rawText: 'Dataset', rawId: 59 },
      { bl: 'dictionary', rawText: 'Dictionary', rawId: 52 },
      { bl: 'editedBook', rawText: 'Edited Book', rawId: 28 },
      { bl: 'electronicArticle', rawText: 'Electronic Article', rawId: 43 },
      { bl: 'electronicBook', rawText: 'Electronic Book', rawId: 44 },
      {
        bl: 'electronicBookSection',
        rawText: 'Electronic Book Section',
        rawId: 60,
      },
      { bl: 'encyclopedia', rawText: 'Encyclopedia', rawId: 53 },
      { bl: 'equation', rawText: 'Equation', rawId: 39 },
      { bl: 'figure', rawText: 'Figure', rawId: 37 },
      { bl: 'filmOrBroadcast', rawText: 'Film or Broadcast', rawId: 21 },
      { bl: 'generic', rawText: 'Generic', rawId: 13 },
      { bl: 'governmentDocument', rawText: 'Government Document', rawId: 46 },
      { bl: 'grant', rawText: 'Grant', rawId: 54 },
      { bl: 'hearing', rawText: 'Hearing', rawId: 14 },
      { bl: 'journalArticle', rawText: 'Journal Article', rawId: 17 },
      {
        bl: 'legalRuleOrRegulation',
        rawText: 'Legal Rule or Regulation',
        rawId: 50,
      },
      { bl: 'magazineArticle', rawText: 'Magazine Article', rawId: 19 },
      { bl: 'manuscript', rawText: 'Manuscript', rawId: 36 },
      { bl: 'map', rawText: 'Map', rawId: 20 },
      { bl: 'music', rawText: 'Music', rawId: 61 },
      { bl: 'newspaperArticle', rawText: 'Newspaper Article', rawId: 23 },
      { bl: 'onlineDatabase', rawText: 'Online Database', rawId: 45 },
      { bl: 'onlineMultimedia', rawText: 'Online Multimedia', rawId: 48 },
      { bl: 'pamphlet', rawText: 'Pamphlet', rawId: 24 },
      { bl: 'patent', rawText: 'Patent', rawId: 25 },
      {
        bl: 'personalCommunication',
        rawText: 'Personal Communication',
        rawId: 26,
      },
      { bl: 'report', rawText: 'Report', rawId: 27 },
      { bl: 'serial', rawText: 'Serial', rawId: 57 },
      { bl: 'standard', rawText: 'Standard', rawId: 58 },
      { bl: 'statute', rawText: 'Statute', rawId: 31 },
      { bl: 'thesis', rawText: 'Thesis', rawId: 32 },
      { bl: 'unpublished', rawText: 'Unpublished Work', rawId: 34 },
      { bl: 'web', rawText: 'Web Page', rawId: 12 },
    ],
    blMap: new Map(), // Calculated later for quicker lookup
    rawMap: new Map(), // Calculated later for quicker lookup
  },
  // }}}
};
