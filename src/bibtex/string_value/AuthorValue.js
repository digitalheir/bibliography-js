import {diacritics, specialChars} from './specialCharsHandlers'
import StringValue from './StringValue'
import PersonName from '../../bibliography/PersonName'

function isPartOfName(char) {
  return (char == ',' || char.match(/\s/));
}

function isLowerCaseChar(ch) {
  return ch.charAt(0).toUpperCase() != ch.charAt(0);
}
function asAuthorToken(conc) {
  //console.log("c,",conc)
  if (conc.type == 'id' || conc.type == ',' || conc.type == 'and') return conc;
  if (typeof conc != 'string')throw new Error("Did not expect " + JSON.stringify(conc));
  switch (conc) {
    case ",":
    case "and":
      return {type: conc};
    default:
      return {
        type: 'id',
        startsWithLowerCase: isLowerCaseChar(conc) || (conc.charAt(0) == '/' && isLowerCaseChar(conc.charAt(1))),
        string: 'conc'
      };
  }
}

function processNames(wrapper) {
  //const tokens = [];
  //for (let i = 0; i < sstring.length; i++) {
  //  if (isPartOfName(sstring.getCharAt(i))) {
  //    const letters = [sstring.getCharAt(i)];
  //    while (i < sstring.length && isPartOfName(sstring.getCharAt(i + 1))) {
  //      letters.push(sstring.getCharAt(i + 1));
  //      i++;
  //    }
  //    tokens.push({type: 'id', data: letters.join('')});
  //  } else if (sstring.charAt(i) == ',') tokens.push({type: 'comma'});
  //  else if (sstring.charAt(i).match(/\s/)) {
  //    // Ignore whitespace
  //  } else throw new Error("?");
  //}
  //wrapper.data
  //grammar.feed(tokens);
}

function splitOnAnd(authorTokens) {
  return authorTokens.reduce((prev, curr)=> {
    //console.log(curr);
    if (curr.length == 1 && curr[0] == 'and') prev.push([]);
    else prev[prev.length - 1].push(curr);
    return prev;
  }, [[]]);
}

function isDigitOrLowerCase(ch) {
  return ch.match(/[0-9]/) || ch.toUpperCase() != ch;
}
function flattenToString(authorToken) {
  if (typeof authorToken == 'string') return authorToken;
  else if (authorToken.type == 'braced')  return flattenToString(authorToken.data);
  else if (authorToken.type == 'ws') {
    //console.log(authorToken)
    return authorToken.string;
  }
  else if (authorToken.unicode)  return authorToken.unicode;
  else if (authorToken.constructor == Array) return authorToken.map(flattenToString).join('');
  else throw new Error("Could not flatten to string: " + JSON.stringify(authorToken));
}
const startsWithLowerCase = function (authorToken) {
  if (typeof authorToken == 'string') {
    if (authorToken.length > 1 && authorToken.charAt(0) == '/') return isDigitOrLowerCase(authorToken.charAt(1));
    else if (authorToken.length > 0) return isDigitOrLowerCase(authorToken.charAt(0));
    else return false;
  } else if (authorToken.type == 'braced')  return startsWithLowerCase(authorToken.data);
  else if (authorToken.unicode)  return startsWithLowerCase(authorToken.unicode);
  else if (authorToken.constructor == Array) return startsWithLowerCase(flattenToString(authorToken).trim());
  else throw new Error("Could not determine lowercase of " + JSON.stringify(authorToken));
};

function firstVonLast(authorTokens) {
  let vonStartInclusive = -1;
  let vonEndExclusive = -1;
  let firstNameEndExclusive = -1;
  for (let i = 0; i < authorTokens.length - 1; i++) {// -1 because last word must be lastName
    //console.log("STARLOW", (authorTokens[i]));
    //console.log("STARLOW", startsWithLowerCase(authorTokens[i]));
    if (startsWithLowerCase(authorTokens[i])) {
      if (vonStartInclusive < 0) vonStartInclusive = i;
      vonEndExclusive = i + 1;
    }
  }
  if (vonStartInclusive > 0) firstNameEndExclusive = vonStartInclusive;
  else firstNameEndExclusive = authorTokens.length - 1;

  const von = vonStartInclusive > 0 ? getSubStringAsNameString(authorTokens, vonStartInclusive, vonEndExclusive) : null;
  const firstName = getSubStringAsNameString(authorTokens, 0, firstNameEndExclusive);
  const lastName = getSubStringAsNameString(authorTokens, Math.max(vonEndExclusive, firstNameEndExclusive), authorTokens.length);
  console.log("von", von)

  return new PersonName(
    firstName,
    von,
    lastName,
    null
  );
}

function vonLastFirst(authorTokens) {
  let commaPos = -1;
  for (let i = 0; i < authorTokens.length; i++)
    if (authorTokens[i].type == ',') {
      commaPos = i;
      break;
    }
  let vonStartInclusive = -1;
  let vonEndExclusive = -1;

  for (let i = 0; i < commaPos; i++)
    if (startsWithLowerCase(authorTokens[i])) {
      if (vonStartInclusive < 0) vonStartInclusive = i;
      vonEndExclusive = i + 1;
    }

  const von = vonStartInclusive > 0 ? getSubStringAsNameString(authorTokens, 0, vonEndExclusive) : null;
  const firstName = getSubStringAsNameString(authorTokens, commaPos + 1, authorTokens.length);
  const lastName = getSubStringAsNameString(authorTokens, Math.max(vonEndExclusive, 0), commaPos);

  return new PersonName(
    firstName,
    von,
    lastName,
    null
  );
}

function word2string(obj) {
  if (typeof obj == 'string') return obj;
  else if (obj.type == 'braced') return word2string(obj.data);
  else if (obj.unicode) return obj.unicode;
  else if (obj.string) return obj.string;
  else if (obj.constructor == Array) return obj.map(word2string).join('');
  else throw new Error("? " + JSON.stringify(obj));
}
function computeUnicodeStringOrNull(words) {
  //TODO make class with toString method
  return words.map(word2string).join(" ");
}
function getSubStringAsNameString(tokens, startIncl, endExcl) {
  let arr = [];
  for (let i = startIncl; i < endExcl; i++) {
    //  console.log(startIncl, endExcl, i, tokens[i])
    arr.push(tokens[i]);
  }
  return computeUnicodeStringOrNull(arr);
}
function vonLastJrFirst(authorTokens) {
  let commaPos = -1;
  for (let i = 0; i < authorTokens.length; i++)
    if (authorTokens[i].type == ',') {
      commaPos = i;
      break;
    }
  let commaPos2 = -1;
  for (let i = commaPos + 1; i < authorTokens.length; i++)
    if (authorTokens[i].type == ',') {
      commaPos2 = i;
      break;
    }
  let vonStartInclusive = -1;
  let vonEndExclusive = -1;

  for (let i = 0; i < commaPos; i++)
    if (startsWithLowerCase(authorTokens[i])) {
      if (vonStartInclusive < 0) vonStartInclusive = i;
      vonEndExclusive = i + 1;
    }

  const von = vonStartInclusive > 0 ? getSubStringAsNameString(authorTokens, 0, vonEndExclusive) : null;
  const firstName = getSubStringAsNameString(authorTokens, commaPos2 + 1, authorTokens.length);
  const jr = getSubStringAsNameString(authorTokens, commaPos + 1, commaPos2);
  const lastName = getSubStringAsNameString(authorTokens, Math.max(vonEndExclusive, 0), commaPos);

  return new PersonName(
    firstName,
    von,
    lastName,
    jr
  );
}

/**
 * BibTEX must be able to distinguish between the different parts of the author field. To that
 * aim, BibTEX recognizes three possible formats:
 * • First von Last;
 * • von Last, First;
 * • von Last, Jr, First.
 *
 * The format to be considered is obtained by counting the number of commas in the name. Here are
 * the characteristics of these formats:
 * @param authorRaw
 */
function parseAuthor(authorRaw) {
  const commaCount = authorRaw.reduce((prev, cur)=> {
      return prev + (cur.type == ',' ? 1 : 0)
    }, 0
  );
  //console.log(commaCount,JSON.stringify(authorRaw));
  switch (commaCount) {
    case 0:
      return firstVonLast(authorRaw);
    case 1:
      return vonLastFirst(authorRaw);
    case 2:
      return vonLastJrFirst(authorRaw);
    default:
      throw new Error("Could not parse author name: found " + commaCount + " commas in " + JSON.stringify(authorRaw));
  }
}
export default class AuthorValue extends StringValue {
  constructor(raw) {
    super(raw);
    const authors = splitOnAnd(this._normalizedRaw);
    this._authors = authors.map(parseAuthor);
  }
}
