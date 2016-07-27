import React, {PropTypes, Component} from 'react';

import {flattenToString, capitalizeFirstLetter, getFirstLetter, startsWithLowerCase} from '../../bibtex/field_value/utils'
import Entry from '../../bibtex/Entry'
import LastName from './LastName'
import PersonName from '../../bibliography/PersonName'
import AuthorValue from '../../bibtex/field_value/AuthorValue'
import StringValue from '../../bibtex/field_value/StringValue'
import PageRange from '../../bibtex/field_value/PageRange'

/* intersperse: Return an array with the separator interspersed between
 * each element of the input array.
 *
 * > _([1,2,3]).intersperse(0)
 * [1,0,2,0,3]
 */
function intersperse(arr, sep) {
  if (arr.length === 0) return [];
  return arr.slice(1).reduce((xs, x) => xs.concat([sep, x]), [arr[0]]);
}

function renderPages(pages) {
  if (!(pages instanceof PageRange)) throw new Error("Expected object to be instance of PageRange");
  return <span className="_bib_pages" key="pages">
      <span itemProp="pageStart">{pages.start}</span>
    {pages.end ? '–' : ''}
    {pages.end ? <span itemProp="pageEnd">{pages.end}</span> : ''}
      </span>;
}

/**
 * See https://owl.english.purdue.edu/owl/resource/747/02/
 */
class Parenthetical extends Component {
  render() {
    const obj = this.props.entry;
    const isEntry = obj instanceof Entry;

    const content = [];

    content.push(renderAuthor())
    if (this.props.pages) content.push(renderPages(this.props.pages));
    else if (obj.fields.pages) content.push(renderPages(obj.fields.pages));

    if (!isEntry) throw new Error("Object must be of type Entry: " + JSON.stringify(obj));
    if (this.props.id) return <a className="_bib_parenthetical_ref" href={"#"+this.props.id}>{content}</a>;
    else if (this.props.href) return <a className="_bib_parenthetical_ref" href={this.props.href}>{content}</a>;
    else return <span className="_bib_parenthetical_ref">{content}</span>;
  }
}
Parenthetical.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  id: PropTypes.any,
  href: PropTypes.string,
  pages: PropTypes.instanceOf(PageRange)
};
export default Parenthetical;
