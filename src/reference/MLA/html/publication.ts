import {BibliographyItem} from "../../../bibliography/Bibliography";
import {htmlPropsDatePublished, htmlPropsPublicationLocation, htmlPropsPublisher} from "../../util";
import {isString} from "../../../../src2/util";
import {span} from "../../html-util";



export function renderPublicationDetailsToHtml(item: BibliographyItem, plusChapterOrPageNumbers: boolean = false): string {
  const details: string[] = [];

  if(item.address) {
    details.push(span("_bib_publication_address", htmlPropsPublicationLocation, item.address));
    if(item.publisher || item.year) details.push(": ");
  }

  if(item.publisher) {
    // todo test if string passes semantic check?
    details.push(span("_bib_publisher", htmlPropsPublisher, item.publisher));
    if(item.year) details.push("; ");
  }

  if(item.year){
    details.push(span("_bib_publication_year", htmlPropsDatePublished, item.publisher));
    if(plusChapterOrPageNumbers && (item.pages || item.chapter)) details.push(":");
  }
  if(plusChapterOrPageNumbers && (item.pages || item.chapter)){
    if(item.pages) {
      // TODO semantic
      details.push(isString(item.pages)?item.pages:item.pages.join("-"));
    }else if(item.chapter) {
      // TODO semantic
      details.push(item.chapter);
    }
  }
  return details.join("");
}
