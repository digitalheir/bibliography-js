
import {Author} from "../../bibliography/fields/Author";

export function determineAuthorNames(authors: Author[]): (Author | "et al")[] {
  if (authors.length > 6) {
    // Siris ES, Miller PD, Barrett-Connor E, et al
    return (<(Author | "et al")[]>authors).slice(0, 3)
    //.map(determineAuthorName)
      .concat(["et al"])
  } else
  // Florez H, Martinez R, Chakra W, Strickman-Stein M, Levis S
    return authors;
}
