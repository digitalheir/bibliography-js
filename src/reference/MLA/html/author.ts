import {Author, renderFullLastName} from "../../../bibliography/fields/Author";
import {BibliographyItem} from "../../../bibliography/Bibliography";
import {determineAuthorNames} from "../../AMA/util";
import {isEtAl} from "../../util";
import {htmlPropsAuthor, span} from "../../html-util";

const htmlPropsAuthorFamilyName = {
  prop: "familyName"
};

const htmlPropsAuthorInitials = {
  // todo // prop: "disambiguatingDescription"
};

// todo // disambiguatingDescription
/**
 * <span class="_bib_author" ...semantic stuff>
 *   <span class="_bib_author_last_name">de la Last Name</span>
 *
 *   <span class="_bib_author_intials">
 *     <span class="_bib_author_intial">A</span>
 *     <span class="_bib_author_intial">B</span>
 *   </span>
 * </span>
 */
// todo // familyName
function renderAuthorToHtml(author: Author): string {
  const names: string[] = [];
  if (author.lastNames.length > 0) {
    names.push(span(
      "_bib_author_last_name",
      htmlPropsAuthorFamilyName,
      renderFullLastName(author)
    ));
    if (author.firstNames.length > 0) names.push(", ");
  }
  if (author.firstNames.length > 0) {
    span(
      "_bib_author_first_name",
      htmlPropsAuthorInitials,
      author.firstNames.join(" ")
    );
  }
  return span("_bib_author",
    htmlPropsAuthor,
    ...names
  );
}

export function renderNamesToHtml(item: BibliographyItem): string | undefined {
  const authorsToRender = determineAuthorNames(item.authors);
  if (authorsToRender.length <= 0) return undefined;
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
