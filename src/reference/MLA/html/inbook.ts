import {renderTitleToHtml} from "./title";
import {BibliographyItem} from "../../../bibliography/Bibliography";
import {renderNamesToHtml} from "./author";
import {push} from "../../util";

export const inBookToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];
  const names = renderNamesToHtml(item);
  if(!!names) parts.push(names);

  const title = renderTitleToHtml(item);
  if(!!title) parts.push(title);

  // TODO
  // "In: {Th Editorius}, ed."
  //

  push(parts,renderJournalToHtml(item));
  push(parts,renderPublicationDetailsToHtml(item, true));

  return span("_bib_item",
    {},
    parts.join(". ")
  )
};
