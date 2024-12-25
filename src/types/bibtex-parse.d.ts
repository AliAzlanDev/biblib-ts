declare module 'bibtex-parse' {
  interface BibTeXEntry {
    type: string;
    key: string;
    [key: string]: any;
  }

  function entries(content: string): BibTeXEntry[];

  const bibtexParse: {
    entries: typeof entries;
  };

  export default bibtexParse;
}
