import {AuthorName, Authors} from "bibtex";
import {convertLaTeXToUnicode} from "../../util";

export interface Author {
  readonly initials: string[];
  readonly firstNames: string[];
  readonly vons: string[];
  readonly lastNames: string[];
  readonly jrs: string[];
}

export function newAuthorFrom(a: AuthorName) {
  return newAuthor(
    a.firstNames.map(convertLaTeXToUnicode),
    a.vons.map(convertLaTeXToUnicode),
    a.lastNames.map(convertLaTeXToUnicode),
    a.jrs.map(convertLaTeXToUnicode),
  );
}

export function newAuthorsFrom(authors?: Authors): Author[] {
  return authors ? authors.authors$.map(author => newAuthorFrom(author)) : [] as Author[];
}

export function newAuthor(firstNames: string[],
                          vons: string[],
                          lastNames: string[],
                          jrs: string[]) {
  return {
    firstNames,
    initials: firstNames.map(s => s ? s.trim().charAt(0) : ""),
    vons,
    lastNames,
    jrs,
  }
}


export function renderFullLastName(author: Author) {
  const name: string[] = [];
  if (author.vons.length > 0) {
    name.push(author.vons.join(" ") + " ");
  }
  name.push(author.lastNames.join(" "));
  return name.join("");
}
