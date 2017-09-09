import {BibliographyItem} from "../../../bibliography/Bibliography";
import {bookToHtml} from "./book";
import {push} from "../../util";
import {renderNamesToHtml} from "./author";
import {renderTitleToHtml} from "./title";
import {renderPublicationDetailsToHtml} from "./publication";


// Based on https://owl.english.purdue.edu/owl/resource/747/01/
// TODO use primary source

function defaultToHtml(item: BibliographyItem) {
  const parts: string[] = [];

  const names = renderNamesToHtml(item);
  push(parts, names);
  parts.push(". ");
  push(parts, renderTitleToHtml(item));
  parts.push(".");
  const pubDetails = renderPublicationDetailsToHtml(item);
  if (pubDetails) {
    push(parts, pubDetails);
    parts.push(".");
  }
  return parts.join("");
}

export function toHtmlAma(item: BibliographyItem) {
  switch (item.type) {
    case "book":
      return bookToHtml(item);
    case "article":
    case "inproceedings":
    default:
      return defaultToHtml(item)
  }
}
