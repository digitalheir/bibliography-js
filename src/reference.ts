import {BibliographyItem} from "./bibliography/Bibliography";
import {Author, renderFullLastName} from "./bibliography/fields/Author";

export interface ReferenceFormat {
  toHtml: (BibliographyItem) => string;
  toMarkdown: (BibliographyItem) => string;
  toPlainText: (BibliographyItem) => string;
  fromPlainText: (string) => BibliographyItem;
}

function renderAuthorName(author: Author) {
  return renderFullLastName(author) + ` ${author.initials.join("")}`;
}

