

import {Author, renderFullLastName} from "../../../bibliography/fields/Author";
import {BibliographyItem} from "../../../bibliography/Bibliography";
import {determineAuthorNames} from "../util";
import {isEtAl} from "../../util";
import {htmlPropsAuthor, span} from "../../html-util";

const htmlPropsAuthorFamilyName = {
  prop: "familyName"
};

const htmlPropsAuthorInitials = {
  prop: "disambiguatingDescription"
};

const spanInitial = (initial: string) => span("_bib_author_initial", {}, initial);
const renderInitials = (author: Author) => author.initials.map(spanInitial).join("");
let spanInitials = author => span(
  "_bib_author_intials",
  htmlPropsAuthorInitials,
  renderInitials(author)
);

let spanLastName = author => span(
  "_bib_author_last_name",
  htmlPropsAuthorFamilyName,
  renderFullLastName(author)
);
// todo disambiguatingDescription
/**
 * <span class="_bib_author" ...semantic stuff>
 *   <span class="_bib_author_last_name">de la Last Name</span>
 *
 *   <span class="_bib_author_intials">
 *     <span class="_bib_author_intial">A</span>
 *     <span class="_bib_author_intial">B</span>
 *   </span>
 * </span>
 */// todo familyName
const renderAuthorToHtml = author => span("_bib_author",
  htmlPropsAuthor,
  spanLastName(author), " ", spanInitials(author),
);

function renderNamesToHtml(ama: BibliographyItem): string | undefined {
  const authorsToRender = determineAuthorNames(ama.authors);
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

export const pushNames = (item: BibliographyItem, parts: string[]) => {
  const names = renderNamesToHtml(item);
  if (!!names) parts.push(names);
};
