import {BibliographyItem} from "../../../bibliography/Bibliography";
import {pushNames} from "./author";
import {pushTitle} from "./title";
import {pushJournalDetails} from "./journal";
import {bookToHtml} from "./book";
import {htmlPropsPublicationLocation} from "../../MLA/html/publication";
import {htmlPropsDatePublished, htmlPropsPublisher} from "../../util";
import {isString} from "../../../../src2/util";


/*

Example:

Salwachter AR, Freischlag JA, Sawyer RG, Sanfey HA. The
training needs and priorities of male and female surgeons
and their trainees. J Am Coll Surg. 2005; 201: 199-205.

Based on http://www.lib.jmu.edu/citation/amaguide.pdf
- Items are listed numerically in the order they are cited in the text
- Include up to 6 authors
- For more than six, provide the names of the first three authors and then add et al
- If there is no author, start with the title
- Periodicals (journals, magazines, and newspapers) should have abbreviated titles; to check for the proper
  abbreviation, search for the Journal Title through LocatorPlus at the National Library of Medicine website

http://libguides.stkate.edu/c.php?g=101857&p=661368
http://library.stkate.edu/citing-writing/

*/






/**
 * Journal article (print)
 *
 * Author(s). Title. Journal. Year;Volume(Issue):Page number(s).
 */
export const articleToHtml = (item: BibliographyItem) => {
  const parts: string[] = [];

  pushNames(item, parts);
  pushTitle(item, parts);
  pushJournalDetails(item, parts);

  return span("_bib_item",
    {},
    parts.join(". ")
  )
};


export function toHtml(item: BibliographyItem) {
  switch (item.type) {
    case "book":
      return bookToHtml(item);
    case "article":
      return articleToHtml(item);
    default:
  }
}
