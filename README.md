# BibLib

A powerful library for parsing various academic reference file formats in Node.js.

## Features

- Parse multiple reference file formats:
  - RIS (Research Information Systems)
  - Medline
  - EndNote XML
  - BibTeX
  - CSV
- Standardized output format for all parsers
- TypeScript support with full type definitions
- Configurable parsing options
- Author name normalization
- DOI handling and validation
- Page number formatting

## Installation

```bash
npm install biblib
```

## Usage

```typescript
import { parseRIS, parseMedline, parseEndnoteXML, parseBibTeX, parseCSV } from 'biblib';

// Parse RIS file
const risRefs = await parseRIS(risContent, {
  defaultType: 'journalArticle',
  delimeter: '\r'
});

// Parse Medline file
const medlineRefs = await parseMedline(medlineContent, {
  reformatAuthors: true,
  journal: 'long',
  parseAddress: true
});

// Parse EndNote XML file
const endnoteRefs = await parseEndnoteXML(xmlContent, {
  defaultType: 'journalArticle'
});

// Parse BibTeX file
const bibtexRefs = await parseBibTeX(bibtexContent, {
  removeComments: true,
  defaultType: 'journalArticle'
});

// Parse CSV file
const csvRefs = await parseCSV(csvContent, {
  defaultType: 'journalArticle'
});
```

## API Reference

### Common Output Format

All parsers return references in a standardized format:

```typescript
interface ReflibRef {
  type?: string;
  title?: string;
  authors?: string[];
  journal?: string;
  year?: string;
  volume?: string;
  number?: string;
  pages?: string;
  doi?: string;
  urls?: string[];
  abstract?: string;
  keywords?: string[];
  date?: string;
  isbn?: string;
  language?: string;
  notes?: string;
  label?: string;
  [key: string]: any;
}
```

### RIS Parser

```typescript
parseRIS(content: string, options?: {
  defaultType?: string;    // Default: 'journalArticle'
  delimeter?: string;      // Default: '\r'
}): Promise<ReflibRef[]>
```

### Medline Parser

```typescript
parseMedline(content: string, options?: {
  defaultType?: string;    // Default: 'journalArticle'
  delimeter?: string;      // Default: '\r'
  reformatAuthors?: boolean; // Default: true
  journal?: 'long' | 'short'; // Default: 'long'
  parseAddress?: boolean;  // Default: true
  parseDoi?: boolean;      // Default: true
  parseYear?: boolean;     // Default: true
}): Promise<ReflibRef[]>
```

### EndNote XML Parser

```typescript
parseEndnoteXML(content: string, options?: {
  defaultType?: string;    // Default: 'journalArticle'
}): Promise<ReflibRef[]>
```

### BibTeX Parser

```typescript
parseBibTeX(content: string, options?: {
  removeComments?: boolean; // Default: true
  defaultType?: string;     // Default: 'journalArticle'
  delimeter?: string;       // Default: '\n'
}): Promise<ReflibRef[]>
```

### CSV Parser

```typescript
parseCSV(content: string, options?: {
  defaultType?: string;    // Default: 'journalArticle'
}): Promise<ReflibRef[]>
```

## Features in Detail

### Author Name Handling

The library automatically normalizes author names into a consistent format (A. Azlan):
- Handles various input formats (Firstname Lastname, Lastname, Firstname, etc.)
- Properly handles middle names and initials
- Preserves suffixes (Jr., Sr., III, etc.)

### DOI Handling

- Automatically adds 'doi.org' prefix when missing
- Validates DOI format
- Removes common prefixes (doi:, http://dx.doi.org/, etc.)

### Page Number Formatting

- Standardizes page number formats (e.g., "123-129", "123--129", "123 to 129")
- Handles single page numbers
- Preserves complex page numbers when needed

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.
