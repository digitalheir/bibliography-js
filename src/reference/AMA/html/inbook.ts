import {pushJournalDetails} from "./journal";
import {pushTitle} from "./title";
import {pushNames} from "./author";
import {BibliographyItem} from "../../../bibliography/Bibliography";
import {isString} from "../../../../src2/util";
import {htmlPropsDatePublished, htmlPropsPublicationLocation, htmlPropsPublisher} from "../../util";

function renderPublicationDetailsToHtml(item: BibliographyItem, plusChapterOrPageNumbers: boolean = false): string {
  const parts: string[] = [];

  if (item.address) {
    parts.push(span("_bib_publication_address", htmlPropsPublicationLocation, item.address));
    if (item.publisher || item.year)
      parts.push(": ");
  }

  if (item.publisher) {
    // todo test if string passes semantic check?
    parts.push(span("_bib_publisher", htmlPropsPublisher, item.publisher));
    if (item.year)
      parts.push("; ");
  }

  if (item.year) {
    parts.push(span("_bib_publication_year", htmlPropsDatePublished, item.publisher));
    if (plusChapterOrPageNumbers && (item.pages || item.chapter))
      parts.push(":");
  }
  if (plusChapterOrPageNumbers && (item.pages || item.chapter)) {
    if (item.pages) {
      // TODO semantic
      parts.push(isString(item.pages) ? item.pages : item.pages.join("-"));
    } else if (item.chapter) {
      // TODO semantic
      parts.push(item.chapter);
    }
  }
  return parts.join("");
}


export const inBookToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];

  pushNames(item, parts);
  pushTitle(item, parts);

  // TODO
  // "In: {Th Editorius}, ed."
  //
  pushJournalDetails(item, parts);

  const publicationDetails = renderPublicationDetailsToHtml(item, true);
  if (!!publicationDetails) parts.push(publicationDetails);

  return span("_bib_item",
    {},
    parts.join(". ")
  )
};
