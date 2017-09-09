import {BibliographyItem} from "../../../bibliography/Bibliography";
import {renderTitleToHtml} from "./title";
import {span} from "../../html-util";
import {renderNamesToHtml} from "./author";
import {pushJournalDetails} from "./journal";
import {renderPublicationDetailsToHtml} from "./publication";
import {push} from "../../util";

export const bookToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];
  const names = renderNamesToHtml(item);
  if (!!names) parts.push(names);

  const title = renderTitleToHtml(item);
  if (!!title) parts.push(title);

  pushJournalDetails(item, parts);

  push(parts, renderPublicationDetailsToHtml(item));

  return span("_bib_item",
    {},
    parts.join(". ")
  )
};
