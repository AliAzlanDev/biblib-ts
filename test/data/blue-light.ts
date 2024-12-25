import { expect } from 'vitest';
import type { BibLibRef } from '../../src/types/index.js';

export let testRefs = [
  {
    // First reference in series
    recNumber: '895',
    type: 'journalArticle',
    title:
      'Formulation of Herbal Gel of Antirrhinum majus Extract and Evaluation of its Anti-Propionibacterium acne Effects',
    authors: [
      'M. Shahtalebi',
      'G. Asghari',
      'F. Rahmani',
      'F. Shafiee',
      'A. Jahanian-Najafabadi',
    ],
    journal: 'Adv Biomed Res',
    year: '2018',
    pages: '53',
    volume: '7',
    abstract:
      'BACKGROUND: Antirrhinum majus contains aurone with excellent antibacterial and antifungal activities. In addition, visible light activates the endogenous porphyrins of Propionibacterium acne, which results in bacterial death. Therefore, considering the above-mentioned facts, the aim of the present study was to prepare a topical herbal gel of A. majus hydroalcoholic extract and to evaluate its antiacne effects with or without blue light combination as an activator of the porphyrins. MATERIALS AND METHODS: Antibacterial activity of the shoot or petal extracts was evaluated by disc diffusion method and the minimum inhibitory concentration (MIC) was calculated. Various gel formulations were developed by the Experimental Design software. The obtained gel formulations were prepared and tested for pharmaceutical parameters including organoleptic features, pH, viscosity, drug content, and release studies. Finally, the antibacterial activity was evaluated against (P. acnes) with or without blue light. RESULTS: The MIC of the extracts showed to be 0.25 μg/ml. Evaluation of the gel formulation showed acceptable properties of the best formulation in comparison to a gel in the market. Pharmaceutical parameters were also in accordance with the standard parameters of the marketed gel. Furthermore, statistical analyses showed significant antibacterial effect for gel when compared to negative control. However, combination of blue light with gel did not show any significant difference on the observed antibacterial effect. CONCLUSION: Because of the statistically significant in vitro antiacne effects of the formulated gel, further clinical studies for evaluation of the healing effects of the prepared gel formulation on acne lesions must be performed.',
    isbn: '2277-9175 (Print)\r2277-9175',
    doi: 'https://doi.org/10.4103/abr.abr_99_17',
    keywords: [
      'Acne',
      'Antirrhinum majus',
      'Propionibacterium acnes',
      'blue light',
    ],
    notes:
      '2277-9175\rShahtalebi, Mohammad Ali\rAsghari, Gholam Reza\rRahmani, Farideh\rShafiee, Fatemeh\rJahanian-Najafabadi, Ali\rJournal Article\r2018/04/17\rAdv Biomed Res. 2018 Mar 27;7:53. doi: 10.4103/abr.abr_99_17. eCollection 2018.',
    custom1: 'There are no conflicts of interest.',
    custom2: 'PMC5887696',
    // pmid: '29657938',
    address:
      "Department of Pharmaceutics, School of Pharmacy and Pharmaceutical Sciences, Isfahan University of Medical Sciences, Isfahan, Iran.\rDepartment of Pharmacognosy, School of Pharmacy and Pharmaceutical Sciences, Isfahan University of Medical Sciences, Isfahan, Iran.\rStudents' Research Committee, School of Pharmacy and Pharmaceutical Sciences, Isfahan University of Medical Sciences, Isfahan, Iran.\rDepartment of Pharmaceutical Biotechnology, School of Pharmacy and Pharmaceutical Sciences, Isfahan University of Medical Sciences, Isfahan, Iran.\rIsfahan Pharmaceutical Sciences Research Center, School of Pharmacy and Pharmaceutical Sciences, Isfahan University of Medical Sciences, Isfahan, Iran.",
  },
  {
    recNumber: '926',
    type: 'journalArticle',
    title:
      'A review of photodynamic therapy (PDT) for the treatment of acne vulgaris',
    authors: [
      'C. Riddle',
      'S. Terrell',
      'M. Menser',
      'D. Aires',
      'E. Schweiger',
    ],
    journal: 'J Drugs Dermatol',
    year: '2009',
    pages: '1010-1019',
    volume: '8',
    number: '11',
    abstract:
      'BACKGROUND: Photodynamic therapy (PDT) is increasing in dermatology. Antibiotic resistance and the challenges of isotretinoin therapy have led to investigation of PDT in the treatment of acne vulgaris. OBJECTIVE: To review the results of clinical trials and case series with respect to light source, topical photosensitizing agent, adverse events, efficacy and skin type. METHODS: A non-critical review is presented of a PubMed search for studies examining PDT in the treatment of acne vulgaris. RESULTS: The authors found 21 clinical trials and case series of various designs. Eight studies employed a split-face design comparing photosensitizer to placebo, no treatment or another photosensitizer. Two trials used three test spots and one control spot per patient. Three studies utilized control subjects receiving no photosensitizer with or without light therapy. All 21 studies reported a reduction in inflammatory lesions and/or a significant improvement in acne. The light sources utilized included blue light, pulsed-dye laser (PDL), intense pulsed light (IPL) and red light. Studies comparing the use of PDT to light therapy alone demonstrated greater improvement in treatment groups pretreated with a photosensitizer. CONCLUSION: All studies reported reduction in inflammatory lesions or significant improvement in acne. Several studies confirm a light source combined with photosensitizer is superior to light alone. Adverse reactions including photosensitivity, pustular eruptions, and crusting varied among photosensitizers and light sources. PDT appears to be a useful therapeutic option for acne patients who are recalcitrant to standard treatments and poor candidates for systemic retinoids. Further studies are still needed before a consensus protocol can be established. Additional investigations are needed to establish optimal incubation time, activating light source and frequency of treatment.',
    isbn: '1545-9616 (Print)\r1545-9616',
    // pmid: '19894368',
  },
];

interface CompareTestRefsOptions {
  /**
   * Keys to exclude when comparing ref-to-ref
   */
  keys?: string[];

  /**
   * Meta profile to set other options
   * Supports 'medline' and 'ris' values
   */
  profile: 'medline' | 'ris' | 'bibtex' | 'csv';

  /**
   * Internal use - processed list of keys to exclude
   */
  excludeKeys?: string[] | Set<string>;
}

export function compareTestRefs(
  refs: BibLibRef[],
  options?: CompareTestRefsOptions,
) {
  // Argument mangling {{{
  let settings = {
    excludeKeys: [] as string[], // explicitly type as string array
    ...options,
  };

  let excludeKeys = [...settings.excludeKeys]; // create new array from existing excludeKeys
  if (settings.profile) {
    if (['medline', 'ris'].includes(settings.profile))
      excludeKeys.push('recNumber');
    if (['medline'].includes(settings.profile)) {
      excludeKeys.push('address', 'isbn', 'notes', 'custom1', 'custom2');
    }
    if (['bibtex'].includes(settings.profile)) {
      excludeKeys.push(
        'address',
        'isbn',
        'custom1',
        'custom2',
        'authors',
        'recNumber',
        'notes',
      );
    }
    if (['csv'].includes(settings.profile)) {
      excludeKeys.push(
        'address',
        'isbn',
        'custom1',
        'custom2',
        'authors',
        'recNumber',
        'notes',
        'pages',
        'volume',
        'number',
        'abstract',
        'keywords',
      );
    }
  }

  const excludeSet = new Set(excludeKeys); // create Set after all pushes are done
  // }}}

  expect(Array.isArray(refs)).toBe(true);

  testRefs.forEach((originalRef) => {
    let computedRef = refs.find(
      (r) =>
        r.title == originalRef.title || r.recNumber == originalRef.recNumber,
    );

    if (!computedRef) {
      console.warn('Cannot find reference', {
        title: originalRef.title,
        recNumber: originalRef.recNumber,
      });
      throw new Error('Reference not found');
    }

    expect(typeof computedRef).toBe('object');
    Object.entries(originalRef).forEach(([key, val]) => {
      if (excludeSet.has(key)) return;
      expect(computedRef).toHaveProperty(key);
      expect(computedRef?.[key]).toEqual(val);
    });
  });
}
