import _ from 'lodash';

export type MutatorName =
  | 'authorRewrite'
  | 'doiRewrite'
  | 'consistentPageNumbering';

type Mutator = {
  title: string;
  description: string;
  handler: (v: string, original?: any) => string;
};

/**
 * This module provides various mutators for strings.
 */
export const mutators: Record<MutatorName, Mutator> = {
  authorRewrite: {
    title: 'Rewrite author names',
    description:
      'Clean up various author specifications into one standard format (Azlan, A.)',
    handler: (author: string) => {
      const regex =
        /^(?:(?<last>[\w-]+),?\s+)?(?:(?<first>[\w-]+)[-.\s]*)?(?:(?<middle>[\w-]+)[-.\s]*)?$/;
      return author.replace(regex, (match, last, first, middle) => {
        // Extract the first part of the initial (before any hyphen)
        const initial = first
          ? `${first.split('-')[0][0]}.` // Take the first letter of the first segment before the hyphen
          : '';
        return `${initial} ${last || ''}`.trim();
      });
    },
  },
  doiRewrite: {
    title: 'Rewrite DOIs',
    description:
      'Attempt to tidy up mangled DOI fields from partial DOIs to full URLs',
    handler(v: string, ref?: { urls: string[] }) {
      if (v) {
        v = v.replace(/\s*\[doi\]$/, '');
        return /^https:\/\//.test(v)
          ? v // Already ok
          : /^http:\/\//.test(v)
            ? v.replace(/^http:/, 'https:') // using HTTP instead of HTTPS
            : 'https://doi.org/' + v;
      } else {
        // Look in ref.urls to try and find a misfiled DOI
        let foundDoi = (ref?.urls ?? []).find((u) =>
          /^https?:\/\/doi.org\//.test(u),
        ); // Find first DOI looking URL
        if (foundDoi)
          return foundDoi
            .replace(/^http:/, 'https:')
            .replace(/\s*\[doi\]$/, '');
        return ''; // Give up and return an empty string
      }
    },
  },
  consistentPageNumbering: {
    title: 'Mutate PubMed page numbering into consistent format',
    description: 'E.g. 244-58 => 244-258',
    handler: (v: string) => {
      // Find page numbers
      let pages = /^(?<from>\d+)\s*(\p{Pd}+(?<to>\d+)\s*)?$/u.exec(v)?.groups;
      if (pages && pages.from && pages.to) {
        // Find the difference in length of the page number strings
        const offset = pages.from.length - pages.to.length;
        // Take the prefix that is missing from the 2nd page number
        const prefix = pages.from.substring(0, offset);
        // Prepend the prefix to the page number
        return `${pages.from}-${prefix + pages.to}`;
      } else if (pages && pages.from) {
        return pages.from;
      } else {
        return '';
      }
    },
  },
};
