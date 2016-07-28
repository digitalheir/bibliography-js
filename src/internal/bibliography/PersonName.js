import referenceFormats from './ReferenceFormats'
import {flattenToString, capitalizeFirstLetter, getFirstLetter, startsWithLowerCase} from '../bibtex/field_value/utils'

function word2string(obj) {
  if (typeof obj == 'string') return obj;
  else if (obj.type == 'braced') return word2string(obj.data);
  else if (obj.unicode) return obj.unicode;
  else if (obj.string) return obj.string;
  else if (obj.constructor == Array) return obj.map(word2string).join('');
  else throw new Error("? " + JSON.stringify(obj));
}

export default class PersonName {
  /**
   * @param firstNames Array of word objects
   * @param vons Array of word objects
   * @param lastNames Array of word objects
   * @param jrs Array of word objects
   */
  constructor(firstNames, vons, lastNames, jrs) {
    this.firstNames = firstNames.map(flattenToString);
    this.initials = firstNames.map(getFirstLetter);
    this.vons = vons.map(flattenToString);
    this.lastNames = lastNames.map(flattenToString);
    this.jrs = jrs.map(flattenToString);
    this.id = this.firstNames.join('-') + '-' + this.vons.join('-') + '-' + this.lastNames.join('-') + '-' + this.jrs.join('-');
  }
}
