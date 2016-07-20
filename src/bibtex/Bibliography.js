import Immutable, {Set} from 'immutable'
import Entry from './Entry'
import AuthorValue from './string_value/AuthorValue'
import StringValue from './string_value/StringValue'

const ID_STRINGS = /id|ws/;

function replaceRefs(wrapper, stringMap) {
  if (wrapper.type == 'quotedstringwrapper')  return {
    type: wrapper.type,
    data: wrapper.data.map(o=> {
      if (o.stringref) {
        if (!stringMap[o.stringref]) throw new Error("Could not find reference to " + o.stringref);
        else return stringMap[o.stringref];
      } else return o;
    })
  };
  else if (wrapper.type == 'bracedstringwrapper') return wrapper;
  else throw new Error("Expected sting wrapper instead of " + JSON.stringify(wrapper));
}
export default class Bibliography {
  /**
   * @param nearleyObject an array of parsed tokens
   */
  constructor(nearleyObject) {
    let strings = {};
    let rawEntries = [];
    let preamble = {};
    nearleyObject.entries.forEach((obj) => {
      if (typeof obj == 'object' && obj._id) // Bib entry
        rawEntries.push(obj);
      else if (typeof obj == 'object') {
        switch (obj.type) {
          case 'string':
            let keyval = obj.data;
            if (strings[keyval.key]) console.log("WARNING: string abbreviated with key " +
              keyval.key + " was already defined. Ignoring value " + keyval.value);
            else strings[keyval.key] = keyval.value;
            break;
          case 'preamble':
            preamble.push(obj);
            break;
          case 'comment':
            break;//Ignore
          default:
            throw new Error("Did not know how to handle parsed object: " + JSON.stringify(obj));
        }
      } else throw new Error("Did not know how to handle parsed token: " + JSON.stringify(obj));
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
    //console.log(JSON.stringify(strings));

    this.strings = StringValue.resolveStrings(strings);


    this.rawEntries = rawEntries;
    this.entries = Bibliography.compileEntries(rawEntries, this.strings);
  }

  static joinStringTokens(arr) {
    //console.log(arr);
    return arr.join('');
  }

  static compileEntries(rawEntries, strings) {
    const entries = {};
    rawEntries.forEach(object => {
      const fields = {};
      const rawFields = object.fields;
      for (let fieldName in rawFields) {
        if (rawFields.hasOwnProperty(fieldName)) {
          // Field name is already normalized (lowercased) as part of nearley postprocessing
          const strRaw = replaceRefs(rawFields[fieldName], strings);

          if (fieldName == 'author') fields[fieldName] = new AuthorValue(strRaw);
          else fields[fieldName] = new StringValue(strRaw);

          //console.log(fieldName + ":", fields[fieldName]);
        }
      }
      entries[object._id] = new Entry(object._id, object['@type'], fields);
    });
    return entries;
  }
}
