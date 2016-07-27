import {flattenToString} from './utils'
import StringValue from './StringValue'
export default class PageRange extends StringValue {
  constructor(raw) {
    super(raw);
    const pages = flattenToString(this._normalizedRaw)
      .replace(/[\-\-~֊־᐀᠆‐‑‒–—―⁓⁻₋−⸗⸺⸻〜〰゠﹘﹣－]+/g, '--') // Replace any dash sequence with double dashes
      .split('--');
    if (pages.length > 2 || pages.length <= 0) throw new Error("Could not parse page range");
    this.start = pages[0];
    this.end = pages[1];
  }
}
