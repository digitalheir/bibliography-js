import StringValue from './StringValue'

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

function flatten(obj) {
  if (typeof obj == 'object' &&
    (obj.type == 'quotedstring' ||
    obj.type == 'quotedstringwrapper' ||
    obj.type == 'bracedstringwrapper')
  ) return flatten(obj.data);
  else if (typeof obj == 'object' && obj.type == 'ws') return obj;
  else if (obj._raw) return flatten(obj._raw);
  else if (typeof obj == 'object' && obj.type == 'id') return obj.string;
  else if (typeof obj == 'string') return obj;
  else if (obj.constructor == Array) {
    let tokens = [];
    obj.forEach(o => {
      const conc = flatten(o);
      //console.log(JSON.stringify(o));
      //console.log(JSON.stringify(conc));
      if (conc.constructor == Array)  tokens = tokens.concat(conc);
      else tokens.push(conc);
    });
    return tokens;
    //return tokens.reduce((prev, curr) => {
    //  const previousToken = prev[prev.length - 1];
    //  if (typeof previousToken == 'string' && typeof curr == 'string')
    //    prev[prev.length - 1] = prev[prev.length - 1] + curr;
    //  else prev.push(curr);
    //  return prev;
    //}, []).map(o => asAuthorToken(o));
  } else if (obj.type == 'braced') {
    const braced = obj.type == 'braced';
    return ({
      type: 'braced',
      data: flatten(obj.data)
    });
  }
  else throw new Error("Could not handle string value to normalize: " + JSON.stringify(obj));
}

function toWords(obj) {
  let words = [[]];

  if (typeof obj == 'object' &&
    (obj.type == 'quotedstring' ||
    obj.type == 'quotedstringwrapper' ||
    obj.type == 'bracedstringwrapper')
  ) words[words.size - 1].concat(toWords(obj.data));
  else if (typeof obj == 'object' && obj.type == 'ws') return obj;
  else if (typeof obj == 'string') return [obj];
  else if (obj.constructor == Array) {
    let tokens = [];
    obj.forEach(o => {
      const conc = toWords(o);
      if (conc.constructor == Array)  tokens = tokens.concat(conc);
      else tokens.push(conc);
    });
    return tokens.reduce((prev, curr) => {
      const previousToken = prev[prev.length - 1];
      if (typeof previousToken == 'string' && typeof curr == 'string')
        prev[prev.length - 1] = prev[prev.length - 1] + curr;
      else prev.push(curr);
      return prev;
    }, []).map(o => asAuthorToken(o));
  } else if (obj.type == 'braced') {
    const braced = obj.type == 'braced';
    words[words.size - 1].push({
      type: 'braced',
      data: toWords(obj.data)
    });
  }
  else throw new Error("! Could not handle string value to normalize: " + JSON.stringify(obj), (typeof obj == 'object' && obj.type == 'id'));


  //
  return words;
}
//function toWord(obj) {
//  else if (typeof obj == 'object' && obj.type == 'id') return obj.string;
//  else if (obj._raw) return toWords(obj._raw);
//  else if (typeof obj == 'object' &&
//    (obj.type == 'quotedstring' ||
//    obj.type == 'quotedstringwrapper' ||
//    obj.type == 'bracedstringwrapper')
//  ) return toWords(obj.data);
//}
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

function splitOnAndToken(authorTokens) {
  return authorTokens.reduce((prev, curr)=> {
    if (curr.length == 1 && typeof curr[0] == 'object' && curr[0].type == 'and') prev.push([]);
    else prev[prev.length - 1].push(curr);
    return prev;
  }, [[]]);
}

function firstVonLast(authorTokens) {
  authorTokens[authorTokens.length - 1];
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
 * @param authorTokens
 */
function parseName(authorTokens) {
  const commaCount = authorTokens.reduce((prev, cur)=>prev + cur.type == ',' ? 1 : 0, 0);
  switch (commaCount) {
    case 0:
      return firstVonLast(authorTokens);
    case 1:
      return vonLastFirst(authorTokens);
    case 2:
      return vonLastJrFirst(authorTokens);
    default:
      throw new Error("Could not parse author name: found " + commaCount + " commas in " + JSON.stringify(authorTokens));
  }
}


export default class AuthorValue extends StringValue {
  constructor(raw) {
    super(raw);
    const authors = flatten(this._raw);
    console.log(JSON.stringify(authors));
    this._authors = authors;
  }
}
