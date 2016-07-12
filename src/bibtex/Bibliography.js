import Immutable, {Set} from 'immutable'
import Entry from './Entry'

export default class Bibliography {
  /**
   *
   * @param nearleyObject an array of parsed tokens
   */
  constructor(nearleyObject) {
    // let comments = [];
    let strings = {};
    let rawEntries = [];
    let preamble = {};
    nearleyObject.map((obj) => {
      if (typeof obj == 'string') {// ignore comments
        //comments.push(obj);
      } else if (typeof obj == 'object' && obj._id) // Bib entry
        rawEntries.push(obj);
      else if (typeof obj == 'object') {
        switch (obj.type) {
          case 'string':
            if (strings[obj.key]) console.log("WARNING: string abbreviated with key " + obj.key + " was already defined. Ignoring value " + obj.value);
            else strings[obj.key] = obj.value;
            break;
          case 'preamble':
            preamble.push(obj);
            break;
          default:
            throw new Error("Did not know how to handle parsed object: " + JSON.stringify(obj));
        }
      }
    });


    /**
     * Anything declared in a @preamble command will be concatenated and put in a variable
     named preamble$, for being used in the bibliography style and, generally, inserted at the beginning of
     the .bbl file, just before the thebibliography environment. This is useful for defining new commands
     used in the bibliography. Here is a small example:

     \@preamble{ "\makeatletter" }
     \@preamble{ "\@ifundefined{url}{\def\url#1{\texttt{#1}}}{}" }
     \@preamble{ "\makeatother" }

     This way, you may safely use the \url command in your entries. If it is not defined at the beginning
     of the bibliography, the default command defined in the @preamble will be used.
     Please note that you should never define style settings in the @preamble of a bibliography database,
     since it would be applied to any bibliography built from this database.
     * @type {{}}
     */
    this.preamble = preamble;
    this.rawStrings = strings;
    this.strings = Bibliography.compileStrings(strings);
    this.rawEntries = rawEntries;
    // todo loop over all raw entries, format them with the use of strings and preamble
    this.entries = Bibliography.compileEntries(rawEntries, this.strings);
  }

  static compileStrings(strings) {
    const refs = {};
    for (let key in strings) {
      if (strings.hasOwnProperty(key) && !refs[key]) {
        var strObjs = strings[key]; // array of string objects; references or plain strings
        const stack = Set.of(key);
        console.log(key, strObjs);
        refs[key] = Bibliography.compileString(stack, strObjs, refs, strings);
      }
    }
    return refs;
  }

  static compileString(referenceStack, strObjs, compiledSoFar, rawStrings) {
    const portions = [];
    strObjs = Bibliography.dissolvesBraces(0, strObjs);
    for (let i in strObjs) {
      if (strObjs.hasOwnProperty(i)) {
        const strObj = strObjs[i];
        if (typeof strObj == 'string')    portions.push(strObj);
        else if (typeof  strObj == 'object' && strObj.stringref) {
          const ref = strObj.stringref;
          if (referenceStack.has(ref)) throw new Error("Cycle detected: " + ref);

          if (compiledSoFar[ref]) portions.push(compiledSoFar[ref]);
          else {
            if (!rawStrings[ref]) throw new Error("Unresolved reference: " + JSON.stringify(strObj));
            compiledSoFar[ref] = Bibliography.compileString(referenceStack.add(ref), rawStrings[ref], compiledSoFar, rawStrings);
            portions.push(compiledSoFar[ref]);
          }
        } else if (strObj.constructor === Array) {
          portions.push(Bibliography.joinStringTokens(strObj));
        } else if (typeof  strObj == 'object' && strObj.type == 'braced') {
          portions.push(Bibliography.compileString(referenceStack, data, compiledSoFar, rawStrings));
        } else if (typeof strObj == 'object' && strObj.type == 'number') {
          portions.push(strObj.string);
        } else if (strObj.constructor === Number) {
          portions.push(strObj);
        }
        else throw new Error("Could not handle string portion " + JSON.stringify(strObj));
      }
    }
    return portions.join('');
  }

  static joinStringTokens(arr) {
    //console.log(arr);
    return arr.join('');
  }

  static compileEntries(rawEntries, strings) {
    const entries = {};
    //console.log(JSON.stringify(strings));
    rawEntries.forEach(object => {
      const fields = {};
      const rawFields = object.fields;
      for (let fieldName in rawFields) {
        if (rawFields.hasOwnProperty(fieldName)) {
          // Field name is already normalized (lowercased) as part of nearley postprocessing
          fields[fieldName] = Bibliography.compileString(Set.of(), rawFields[fieldName], strings, {});
        }
      }
      entries[object._id] = new Entry(object._id, object['@type'], fields);
    });
    return entries;
  }

  static dissolvesBraces(braceDepth, strObjs) {
    let returnMe = [];
    for (let i in strObjs) {
      if (strObjs.hasOwnProperty(i)) {
        let strObj = strObjs[i];
        if (typeof  strObjs[i] == 'object' && strObjs[i].type == 'braced') {
          const data = strObj.data;
          if (braceDepth == 0 && data.length > 0 && typeof data[0] == 'string' && data[0][0] == '\\') {
            console.log("SPECIAL CHAR: " + JSON.stringify(data))
          }

          returnMe.pushAll(Bibliography.dissolvesBraces(braceDepth + 1, data));
        } else returnMe.push(strObj);
      }
    }
  }

  static purify$() {
//     There are thirteen LATEX commands that won’t follow the above rules: \OE, \ae, \AE,
//       \aa, \AA, \o, \O, \l, \L, \ss. Those commands correspond to ı, , œ, Œ, æ, Æ, å, Å, ø, Ø, ł, Ł,
//       ß, and purify$ transforms them (if they are in a special character, in i, j, oe, OE, ae, AE, aa,
//       AA, o, O, l, L, ss, respectively.
    const translateEscaped = {
      'i': 'ı',
      'j': 'ȷ',
      'oe': 'œ',
      'OE': 'Œ',
      'ae': 'æ',
      'AE': 'Æ',
      'aa': 'å',
      'AA': 'Å',
      'o': 'ø',
      'O': 'Ø',
      'ss': 'ß',
      'l': 'ł',
      'L': 'Ł'
    };
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
}
