import {BibliographyItem} from "../../../bibliography/Bibliography";
import {capitalizeFirstLetter} from "../../../../src2/util";

function renderTitleToHtml(item: BibliographyItem): string {
  // TODO some substrings must be immune to tranformation!
  return capitalizeFirstLetter(item.title.toLowerCase());
}

export const pushTitle = function (item: BibliographyItem, parts: string[]) {
  const title = renderTitleToHtml(item);
  if (!!title) parts.push(title);
};
