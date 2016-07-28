import React, {PropTypes, Component} from 'react';

import {
  flattenToString,
  capitalizeFirstLetter,
  getFirstLetter,
  startsWithLowerCase
} from '../../bibtex/field_value/utils'
import Entry from '../../bibtex/Entry'
import LastName from '../LastName'
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
  return <span className="_bib_p_pages" key="pages">
      <span itemProp="pageStart">{pages.start}</span>
    {pages.end ? '-' : ''}
    {pages.end ? <span itemProp="pageEnd">{pages.end}</span> : ''}
      </span>;
}

var renderName = function (author) {
  return <span itemProp="author"
               itemScope={true}
               itemType="https://schema.org/Person"
               key={author.id}
               className="_bib_p_author">
          <LastName name={author}/>
        </span>;
};
/**
 * See https://owl.english.purdue.edu/owl/resource/747/02/
 */
class Parenthetical extends Component {
  renderAuthors(obj) {
    const children = [];

    if (!obj.fields.author) throw new Error("Entry with id " + obj.id + " did not have author set.");
    const authors = obj.fields.author.getAuthors();
    if (authors.length <= 3) {
      const commad = intersperse(authors.map(renderName),
        ', ');
      for (let i = 0; i < commad.length; i++) if (i == (commad.length - 2)) {
        if (commad[i] != ',')throw new Error('Expected ' + i + " to be ', '");
        commad[i] = 'and ';
      }
      commad.forEach(o=>children.push(o));
    } else {
      children.push(renderName(authors[0]));
      children.push(" et al.");
    }
    if (this.props.showPage && (this.props.pages || obj.fields.pages))
      children.push(' ');

    return children;
  }

  render() {
    const obj = this.props.entry;
    const isEntry = obj instanceof Entry;
    if (!isEntry) throw new Error("Object must be of type Entry: " + JSON.stringify(obj));

    const children = [];

    children.push("(");
    if (this.props.showAuthor) {
      children.push(<span key="authors" className="_bib_p_authors">{this.renderAuthors(obj)}</span>)
    }

    if (this.props.showPage && this.props.pages)
      children.push(renderPages(this.props.pages));
    else if (this.props.showPage && obj.fields.pages)
      children.push(renderPages(obj.fields.pages));

    children.push(")");

    const props = {
      className: "_bib_citation _bib_mla",
      href: (this.props.id) ? "#" + this.props.id : ((this.props.href) ? this.props.href : undefined),
      itemScope: true,
      itemType: "https://schema.org/CreativeWork"
    };
    if (this.props.citation) props['itemProp'] = 'citation';
    return React.createElement(
      props.href ? 'a' : 'span',
      props,
      children
    );
  }

}
Parenthetical.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  id: PropTypes.any,
  href: PropTypes.string,
  pages: PropTypes.instanceOf(PageRange),
  showAuthor: PropTypes.bool,
  showPage: PropTypes.bool
};
Parenthetical.defaultProps = {
  showAuthor: true,
  showPage: true
}
export default Parenthetical;
