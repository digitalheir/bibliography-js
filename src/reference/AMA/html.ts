import {BibliographyItem} from "../../bibliography/Bibliography";
import {Author, renderFullLastName} from "../../bibliography/fields/Author";
import {determineAuthorNames, isEtAl} from "./util";


function renderAuthorToHtml(author: Author): string {
  return span("_bib_author",
    Object.assign({}, htmlPropsAuthor),
    span(
      "_bib_author_last_name",
      {/*todo*/},
      renderFullLastName(author)
    )
  );
}

function renderNamesToHtml(ama: BibliographyItem) {
  return span("_bib_author_name",
    {itemprop: "name"},
    determineAuthorNames(ama.authors)
      .map(author => {
        if (isEtAl(author))
          return span("_bib_author_et_al", {}, author);
        else
          return renderAuthorToHtml(author);
      })
      .join(", ") + "."
  );
}

export function toHtml(ama: BibliographyItem) {
  return span("_bib_item",
    {},
    renderNamesToHtml(ama)
  )
}
