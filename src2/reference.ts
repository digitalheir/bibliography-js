import {BibliographyItem} from "../src/bibliography/Bibliography";
import {Author, renderFullLastName} from "../src/bibliography/fields/Author";

export interface ReferenceFormat {
  toHtml: (BibliographyItem) => string;
  toMarkdown: (BibliographyItem) => string;
  toPlainText: (BibliographyItem) => string;
  fromPlainText: (string) => BibliographyItem;
}

function renderAuthorName(author: Author) {
  return renderFullLastName(author) + ` ${author.initials.join("")}`;
}

