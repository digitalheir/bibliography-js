import {capitalizeFirstLetter} from "../../../../src2/util";
import {BibliographyItem} from "../../../bibliography/Bibliography";
import {span} from "../../html-util";

export function renderTitleToHtml(item: BibliographyItem): string {
  // TODO some substrings must be immune to tranformation!
  return span("_bib_title", {},
    capitalizeFirstLetter(item.title.toLowerCase())
  );
}
