

import {PageRange} from "./fields/PageRange";
import {Author} from "./fields/Author";

export type BibliographyItem = {[key: string]: any} & {
  authors: Author[];
  title: string;
  pages?: PageRange;
};

const i: BibliographyItem = {
  a: "abc",
  title: "abc",
  authors: []
};
