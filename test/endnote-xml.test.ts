import { describe, it, expect } from 'vitest';
import { compareTestRefs } from './data/blue-light.js';
import { parseEndnoteXML } from '../src/endnote-xml.js';
import { readFile } from 'fs/promises';

describe('Module: endnoteXml', () => {
  /**
   * This test verifies that the XML parser doesn't split things like 'Foo &amp; Bar' into multiple parts when parsing
   */
  it('should parse a multipart EndNote XML file', async () => {
    const content = await readFile('test/data/multipart.xml', 'utf8');
    const refs = await parseEndnoteXML(content);

    expect(refs).toBeInstanceOf(Array);
    expect(refs).toHaveLength(1);
    expect(refs[0]).toBeInstanceOf(Object);
    expect(refs[0]).toHaveProperty('recNumber', '1 & 2');
    expect(refs[0]).toHaveProperty('type', 'journalArticle');
    expect(refs[0]).toHaveProperty('authors');
    expect(refs[0]?.authors).toEqual(['Foo & Bar', 'Baz & Quz']);
    expect(refs[0]).toHaveProperty('address', 'Foo & Bar');
    expect(refs[0]).toHaveProperty('title', 'Foo & Bar');
    expect(refs[0]).toHaveProperty('journal', 'Foo & Journal');
    expect(refs[0]).toHaveProperty('keywords');
    expect(refs[0]?.keywords).toEqual(['Foo & Bar', 'Baz & Quz']);
  });

  it('should parse a EndNote XML file', async () => {
    const content = await readFile('test/data/blue-light.xml', 'utf-8');
    const refs = await parseEndnoteXML(content);

    await compareTestRefs(refs);
  });
});
