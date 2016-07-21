import referenceFormats from './ReferenceFormats'
import {flattenToString, capitalizeFirstLetter, getFirstLetter, startsWithLowerCase} from '../bibtex/string_value/utils'

function computeUnicodeStringOrNull(words) {
  //TODO make class with toString method
  return words.map(word2string).join(" ");
}

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
  }

  toString(referenceFormat) {
    switch (referenceFormat) {
      case referenceFormats.FULL_VON:
        return this.vons.join(" ");
      case referenceFormats.FULL_LAST_NAME_WO_VON:
        return this.lastNames.join(" ");
      case referenceFormats.FULL_LAST_NAME:
        const vonString = this.toString(referenceFormats.FULL_VON);
        return (vonString.length <= 0 ? '' : (vonString + " ")) + this.toString(referenceFormats.FULL_LAST_NAME_WO_VON);
      case referenceFormats.AMA:
        let initialz = this.initials.join('');
        if (initialz.length > 0) initialz = ' ' + initialz;
        let jrz = this.jrs.map(capitalizeFirstLetter).join(' ');
        if (jrz.length > 0) jrz = ' ' + jrz;
        return this.toString(referenceFormats.FULL_LAST_NAME) + initialz + jrz;
      default:
        throw new Error("Unknown reference format");
    }
  }

  fullLastName() {
  }
}
