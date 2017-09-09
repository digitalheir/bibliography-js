import {PageRange} from "./fields/PageRange";
import {Author, newAuthor, newAuthorFrom, newAuthorsFrom} from "./fields/Author";
import {Authors, BibEntry, normalizeFieldValue, parseBibFile} from "bibtex";
import {convertLaTeXToUnicode} from "../util";

export type BibliographyItem = { [key: string]: any } & {
  _id: string;
  type: string;
  title: string;
  authors: Author[];
  pages?: PageRange;
};

const createBibliographyItem = (entry: BibEntry): BibliographyItem => {
  const titleField = normalizeFieldValue(entry.getField("title"));
  return {
    _id: entry._id,
    type: entry.type,
    title: titleField ? convertLaTeXToUnicode(titleField) : "",
    authors: newAuthorsFrom(entry.getAuthors())
  };
};

export function fromBibtex(input: string): {[id: string]: BibliographyItem} {
  const bibfile = parseBibFile(input);
  const items: {[id: string]: BibliographyItem} = {};
  Object.keys(bibfile.entries$)
    .map(key => bibfile.entries$[key])
    .map(createBibliographyItem)
    .forEach(item => items[item._id] = item)
  ;
  return items;
}
