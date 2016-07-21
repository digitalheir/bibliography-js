import {diacritics, specialChars} from './specialCharsHandlers'
import Immutable, {Set} from 'immutable'

function flatten(obj) {
  if (typeof obj == 'object' &&
    (obj.type == 'quotedstring' ||
    obj.type == 'quotedstringwrapper' ||
    obj.type == 'bracedstringwrapper')
  ) return flatten(obj.data);
  else if (typeof obj == 'object' && obj.type == 'ws') return obj;
  else if (obj._raw) return flatten(obj._raw);
  else if (typeof obj == 'object' && obj.string) return obj.string;
  else if (obj.constructor == Number) return obj+"";
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

function toWords(wordParts, retainWhitespace) {
  return wordParts.reduce((prev, current)=> {
    if (current.type == 'ws') {
      if (retainWhitespace) prev[prev.length - 1].push(current)
      else prev.push([]);
    }
    else if (current.type == 'braced') prev[prev.length - 1].push({
      type: current.type,
      data: toWords(current.data, true)
    });
    else if (current.type == ',') {
      prev.push(current);
      //prev[prev.length - 1].push(current)
    }
    else if (typeof current == 'string') prev[prev.length - 1].push(current);
    else throw new Error("! toWords error: " + JSON.stringify(current));
    return prev;
  }, [[]])
}
function concatStrings(array) {
  const words = [];
  for (let i = 0; i < array.length; i++) {
    const obj = array[i];
    if (obj == ',') words.push({type: ','});
    else if (typeof obj == 'string') {
      if (typeof(words[words.length - 1]) == 'string') words[words.length - 1] = words[words.length - 1] + obj;
      else words.push(obj);
    } else if (obj.type == 'ws') words.push(obj);
    else if (obj.type == 'braced') words.push({
      type: obj.type,
      data: concatStrings(obj.data)
    });
    else throw new Error("Could not handle string value to concat: " + JSON.stringify(obj));
  }
  return words;
}

/**
 * A special character is a
 * part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
 * and ending with the corresponding right brace. For instance, in the above example, there is no special
 * character, since \LaTeX is at depth 2. It should be noticed that anything in a special character is
 * considered as being at brace depth 0, even if it is placed between another pair of braces.
 */
function processSpecialChars(words) {
  return words.map(word=> {
    if (word.constructor == Array) {
      return word.map(wordSegment => {
        if (wordSegment.type == 'braced'
          && wordSegment.data[0]
          && wordSegment.data[0].constructor == Array
          && wordSegment.data[0].length == 1
          && typeof wordSegment.data[0][0] == 'string'
          && wordSegment.data[0][0].charAt(0) == '\\') {
          const escapeString = wordSegment.data[0][0];
          const specialChar = specialChars[escapeString.substring(1)];
          if (specialChar) return {
            type: 'specialChar',
            data: wordSegment,
            unicode: specialChar(specialChar)
          };
          const diacriticHandler = diacritics[escapeString.charAt(1)];
          if (diacriticHandler) return {
            type: 'specialChar',
            data: wordSegment,
            unicode: diacriticHandler(escapeString.substring(2))
          };
          throw new Error("Unexpected escape string: " + escapeString);
        }
        return wordSegment;
      });
    }
    else return word;
  });
}

/**
 * String wrapper that is meant to deal with the subtleties of BiBTeX / LaTeX styling.
 * Class is pretty incomplete, but we may want a higher-level class to do store formatting information or something.
 */
export default class StringValue {
  constructor(strRaw) {
    if (!strRaw) throw new Error("Please specify string contents");
    if (strRaw.type != 'quotedstringwrapper' && strRaw.type != 'bracedstringwrapper')
      throw new Error("Did not expect object to instantiate StringValue: " + JSON.stringify(strRaw));

    this._raw = strRaw;
    this._normalizedRaw = processSpecialChars(toWords(concatStrings(flatten(this._raw))));
    console.log("Computed",JSON.stringify(this._normalizedRaw));

    //todo for any value of _raw
    this._unicode = StringValue.computeUnicodeString(0, this._raw);
  }

  toUnicode() {
    return this._unicode;
  }

  // Will turn to lowercase:
  // {\'{E}}cole
  // {\'E}cole
  //
  // Will not turn to lowercase:
  // {{\'E}}cole
  lowercase$() {

  }

  static purify$() {
//     There are thirteen LATEX commands that won’t follow the above rules: \OE, \ae, \AE,
//       \aa, \AA, \o, \O, \l, \L, \ss. Those commands correspond to ı, , œ, Œ, æ, Æ, å, Å, ø, Ø, ł, Ł,
//       ß, and purify$ transforms them (if they are in a special character, in i, j, oe, OE, ae, AE, aa,
//       AA, o, O, l, L, ss, respectively.
    const purifyEscapeExceptions = {
      'i': 'i',
      'j': 'j',
      'oe': 'oe',
      'OE': 'OE',
      'ae': 'ae',
      'AE': 'AE',
      'aa': 'aa',
      'AA': 'AA',
      'o': 'o',
      'O': 'O',
      'ss': 'ss',
      'l': 'l',
      'L': 'L'
    }
  }

  // TODO
  // The following ten characters have special meanings in (La)TeX:
  // & % $ # _ { } ~ ^ \
  // Outside \verb, the first seven of them can be typeset by prepending a backslash; for the other three, use the macros \textasciitilde, \textasciicircum, and \textbackslash.
  static computeUnicodeString(braceDepth, obj) {
    //console.log(braceDepth, JSON.stringify(obj));
    if (typeof obj == 'string') return obj;
    else if (obj.constructor == Array) return obj.map(o => {
      if (!o) throw new Error("Expected non-null elements in " + JSON.stringify(o));
      //console.log("array", obj);
      return StringValue.computeUnicodeString(braceDepth, o);
    }).join('');
    else if (obj.toUnicode) {
      //console.log("toUnicode", JSON.stringify(obj));
      //console.log("toUnicode", (obj.toUnicode()));
      return obj.toUnicode();
    }
    else if (typeof obj == 'object' && (obj.type == 'number' || obj.type == 'id' || obj.type == 'ws')) return StringValue.computeUnicodeString(0, obj.string);
    else if (typeof obj == 'object' && obj.unicode) return obj.unicode;
    else if (obj.constructor === Number) return obj + "";
    else if (typeof obj == 'object' && obj.type == 'quotedstring') return StringValue.computeUnicodeString(braceDepth, obj.data);
    else if (typeof obj == 'object' && (obj.type == 'quotedstringwrapper' || obj.type == 'bracedstringwrapper')) return StringValue.computeUnicodeString(0, obj.data);
    /**
     * A special character is a
     * part of a field starting with a left brace being at brace depth 0 immediately followed with a backslash,
     * and ending with the corresponding right brace. For instance, in the above example, there is no special
     * character, since \LaTeX is at depth 2. It should be noticed that anything in a special character is
     * considered as being at brace depth 0, even if it is placed between another pair of braces.
     */
    else if (braceDepth == 0 && obj.type == 'braced' && obj.data[0] == '\\') {
      // Found special character
      const escapeString = StringValue.joinSimpleString(obj.data);

      const specialChar = specialChars[escapeString.substring(1)];
      if (specialChar) return specialChar(specialChar);

      const diacriticHandler = diacritics[escapeString.charAt(1)];
      if (diacriticHandler) return diacriticHandler(escapeString.substring(2));

      throw new Error("Unexpected escape string: " + escapeString);
    } else if (obj.type == 'braced') {
      const braced = obj.type == 'braced';
      return StringValue.computeUnicodeString(braceDepth, obj.data.map(o => {
        if (!o) throw new Error("Expected non-null elements in " + JSON.stringify(o));
        //console.log("braced", obj.data);
        return StringValue.computeUnicodeString(braceDepth + 1, o)
      }));
    }
    else throw new Error("Could not handle string value to turn into Unicode: " + JSON.stringify(obj));
  }

  static joinSimpleString(data) {
    if (typeof data == 'string') return data;
    else if (data.constructor == Array) {
      const str = [];
      for (let i = 0; i < data.length; i++) {
        str.push(StringValue.joinSimpleString(data[i]));
      }
      return str.join('');
    }
    else if (typeof data.string == 'string') return data.string;
    else if (data.type == 'braced') return StringValue.joinSimpleString(data.data);
    else if (typeof data.data == 'string') return data.string;
    else throw new Error("Could not read escaped string value " + JSON.stringify(data));
  }


  static resolveStrings(keyvals) {
    const refs = {};
    for (let key in keyvals)
      if (keyvals.hasOwnProperty(key) && !refs[key])
        refs[key] = StringValue.resolveStringDeclarations(Set.of(), keyvals[key], refs, keyvals);
    return refs;
  }

  static resolveStringDeclarations(referenceStack, wrapper, compiledSoFar, rawStrings) {
    if (wrapper.type == 'quotedstringwrapper') {
      return new StringValue({
        type: wrapper.type,
        data: wrapper.data.map((strObj) => {
          if (typeof strObj == 'object' && strObj.stringref) {
            const refName = strObj.stringref;
            if (referenceStack.has(refName)) throw new Error("Cycle detected: " + refName);
            if (compiledSoFar[refName]) return compiledSoFar[refName];
            if (!rawStrings[refName]) throw new Error("Unresolved reference: " + JSON.stringify(strObj));
            //console.log("RESOLVE", refName);
            compiledSoFar[refName] = StringValue.resolveStringDeclarations(referenceStack.add(refName), rawStrings[refName], compiledSoFar, rawStrings);
            return compiledSoFar[refName];
          } else if (strObj._raw) return strObj;
          else return strObj;
        })
      });
    }
    else if (wrapper.type == 'bracedstringwrapper') return new StringValue(wrapper);
    else throw new Error("Unexpected object to resolve: " + JSON.stringify(wrapper));
  }

}


