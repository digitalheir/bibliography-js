import {BibliographyItem} from "../../../bibliography/Bibliography";
import {pushNames} from "./author";
import {pushTitle} from "./title";
import {pushJournalDetails} from "./journal";



export const bookToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];

  pushNames(item, parts);
  pushTitle(item, parts);
  pushJournalDetails(item, parts);

  return span("_bib_item",
    {},
    parts.join(". ")
  )
};
