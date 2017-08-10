import {BibliographyItem} from "../../bibliography/Bibliography";
import {Author, renderFullLastName} from "../../bibliography/fields/Author";
import {determineAuthorNames, isEtAl} from "./util";
import {capitalizeFirstLetter} from "../../util";


const renderInitials = (author: Author) => author.initials.map(i => span("_bib_author_intial",{},i));

// Based on http://www.lib.jmu.edu/citation/amaguide.pdf
//  Items are listed numerically in the order they are cited in the text
//  Include up to 6 authors
//  For more than six, provide the names of the first three authors and then add et al
//  If there is no author, start with the title
//  Periodicals (journals, magazines, and newspapers) should have abbreviated titles; to check for the proper
//   abbreviation, search for the Journal Title through LocatorPlus at the National Library of Medicine website

// http://libguides.stkate.edu/c.php?g=101857&p=661368
// http://library.stkate.edu/citing-writing/

const htmlPropsAuthorFamilyName = {
  prop: "familyName"
};

const htmlPropsPublicationLocation = {
  prop: "locationCreated"
};

const htmlPropsAuthorInitials = {
  prop: "disambiguatingDescription"
};

const htmlPropsDatePublished = {
  prop: "datePublished"
};

disambiguatingDescription
/**
 * <span class="_bib_author" ...semantic stuff>
 *   <span class="_bib_author_last_name">de la Last Name</span>
 *
 *   <span class="_bib_author_intials">
 *     <span class="_bib_author_intial">A</span>
 *     <span class="_bib_author_intial">B</span>
 *   </span>
 * </span>
 */familyName
function renderAuthorToHtml(author: Author): string {
  return span("_bib_author",
    htmlPropsAuthor,
    span(
      "_bib_author_last_name",
      htmlPropsAuthorFamilyName,
      renderFullLastName(author)
    ),
    " ",
    span(
      "_bib_author_intials",
      htmlPropsAuthorInitials,
      renderInitials(author)
    ),
  );
}
function renderNamesToHtml(ama: BibliographyItem): string | undefined {

  const authorsToRender = determineAuthorNames(ama.authors);
  if(authorsToRender.length <= 0) return undefined;
  return span("_bib_author_name",
    {itemprop: "name"},
    authorsToRender
      .map(author => {
        // TODO "editors,"?
        if (isEtAl(author))
          return span("_bib_author_et_al", {}, author);
        else
          return renderAuthorToHtml(author);
      })
      .join(", ")
  );
}

function renderTitleToHtml(item: BibliographyItem): string {
  // TODO some substrings must be immune to tranformation!
  return capitalizeFirstLetter(item.title.toLowerCase());
}

function renderPublicationDetailsToHtml(item: BibliographyItem, plusChapterOrPageNumbers: boolean = false): string {
  const parts = [];

  if(item.address) {
    parts.push(span("_bib_publication_address", htmlPropsPublicationLocation, item.address));
    if(item.publisher || item.year)
      parts.push(": ");
  }

  if(item.publisher) {
    // todo test if string passes semantic check?
    parts.push(parts.push(span("_bib_publisher", htmlPropsPublisher, item.publisher));)
    if(item.year)
      parts.push("; ");
  }

  if(item.year){
    parts.push(parts.push(span("_bib_publication_year", htmlPropsDatePublished, item.publisher));)
    if(plusChapterOrPageNumbers && (item.pages || item.chapter))
      parts.push(":");
  }
  if(plusChapterOrPageNumbers && (item.pages || item.chapter)){
    if(item.pages) {
      // TODO semantic
      parts.push(isString(item.pages)?item.pages:item.pages.join("-"));
    }else if(item.chapter) {
      // TODO semantic
      parts.push(item.chapter);
    }
  }
  return details.length > 0 ? details.join("");
}

export const bookToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];
  const names = renderNamesToHtml(item);
  if(!!names) parts.push(names);
  
  const title = renderTitleToHtml(item);
  if(!!title) parts.push(title);
  
  const journal = renderJournalToHtml(item);
  if(!!journal) parts.push(journal);
  
  const publicationDetails = renderPublicationDetailsToHtml(item);
  if(!!publicationDetails) parts.push(publicationDetails);
  
  return span("_bib_item",
    {},
    parts.join(". ")
  )
}
  
export const inBookToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];
  const names = renderNamesToHtml(item);
  if(!!names) parts.push(names);
  
  const title = renderTitleToHtml(item);
  if(!!title) parts.push(title);
  
  // TODO
  // "In: {Th Editorius}, ed."
  //
  
  const journal = renderJournalToHtml(item);
  if(!!journal) parts.push(journal);
  
  const publicationDetails = renderPublicationDetailsToHtml(item, true);
  if(!!publicationDetails) parts.push(publicationDetails);
  
  return span("_bib_item",
    {},
    parts.join(". ")
  )
}
  
export function toHtml(item: BibliographyItem) {
  switch(item.type) {
    case "book":
      return bookToHtml(item);
    case "article":
    default:
  }
}
