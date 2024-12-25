export interface BibLibRef {
  [key: string]: string | string[] | undefined;
  type?: string;
  title?: string;
  journal?: string;
  authors?: string[];
  medlineAuthorsFull?: string[];
  medlineAuthorsShort?: string[];
  medlineAuthorsAffiliation?: string[];
  medlineAuthorsId?: string[];
  date?: string;
  year?: string;
  urls?: string[];
  pages?: string;
  volume?: string;
  number?: string;
  isbn?: string;
  abstract?: string;
  label?: string;
  caption?: string;
  notes?: string;
  address?: string;
  researchNotes?: string;
  keywords?: string[];
  accessDate?: string;
  accession?: string;
  doi?: string;
  section?: string;
  language?: string;
  databaseProvider?: string;
  database?: string;
  workType?: string;
  custom1?: string;
  custom2?: string;
  custom3?: string;
  custom4?: string;
  custom5?: string;
  custom6?: string;
  custom7?: string;
  _pageStart?: string;
  _pageEnd?: string;
}

export interface TransField {
  bl: string;
  raw: string;
  sort?: number | false;
  outputRepeat?: boolean;
  inputArray?: boolean;
  trimDotSuffix?: boolean;
  outputSkip?: boolean;
}

export interface TransType {
  bl: string;
  raw?: string;
  rawText?: string;
  rawId?: number;
}

export interface Translations {
  fields: {
    collection: TransField[];
    collectionOutput: TransField[];
    rawMap: Map<string, TransField>;
    blMap: Map<string, TransField>;
  };
  types: {
    collection: TransType[];
    rawMap: Map<string, TransType>;
    blMap: Map<string, TransType>;
  };
}
