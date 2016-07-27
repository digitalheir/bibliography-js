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

function renderPersonName(name, i) {
  if (!(name instanceof PersonName))throw new Error("Object must be of type PersonName: " + (name));
  const parts = [];

  // Render last name (von + lastName)
  parts.push(<LastName key="author_lastname" name={name}/>);

  if (name.jrs.length > 0) parts.push(name.jrs.map(capitalizeFirstLetter).join(' '));
  if (name.initials.length > 0) parts.push(name.initials.join(""));

  return <span key={i} itemProp="author" itemScope={true} itemType="https://schema.org/Person" className="_bib_author">
    <span itemProp="name">
      {intersperse(parts, ' ')}
    </span>
     </span>;
}

function renderAuthors(authors) {
  let authorsString = [];
  if (authors)
    if (authors.length > 6) {
      // Siris ES, Miller PD, Barrett-Connor E, et al
      const toList = [];
      for (let i = 0; i < 3; i++) toList.push(authors[i]); // List first 3
      authorsString = intersperse(toList.map(renderPersonName), ', ');
      authorsString.push(", et al");
    } else // Florez H, Martinez R, Chakra W, Strickman-Stein M, Levis S
      authorsString = intersperse(authors.map(renderPersonName), ', ');
  return authorsString;
}

function renderPages(pages) {
  if (!(pages instanceof PageRange)) throw new Error("Expected object to be instance of PageRange");
  return <span className="_bib_pages" key="pages">
      <span itemProp="pageStart">{pages.start}</span>
    {pages.end ? '–' : ''}
    {pages.end ? <span itemProp="pageEnd">{pages.end}</span> : ''}
      </span>;
}
function renderVolume(vol, partOfId) {
  if (!(vol instanceof StringValue)) throw new Error("Expected object to be instance of StringValue");
  return <span key="volume" itemProp="isPartOf"
               itemScope={true}
               itemType="https://schema.org/PublicationVolume"
               className="_bib_volume">
    <span itemProp="volumeNumber">{vol.toUnicode()}</span>
    {(!!partOfId) ? <link itemProp="isPartOf" href={'#' + partOfId}/> : ''}
    </span>;
}

/**
 * todo Abbreviate the title of the journal according to the listing in PubMed.
 *
 * For example:
 * Science. 2008;321(5896):1693-1695.
 *
 * @param obj Entry object
 * @returns {string} HTML containing journal data
 */
function renderJournal(obj) {
  const journalParts = [];

  const journalId = obj.fields['journal'] ? ("_bib_journal_" + obj.fields['journal'].toUnicode()) : null;
  if (journalId) {
    journalParts.push(<span key="journal_name"><cite
      itemScope={true}
      itemType="https://schema.org/Periodical"
      itemID={"#"+ journalId}
      className="_bib_journal">
      <span itemProp="name">{obj.fields['journal'].toUnicode()}</span>
    </cite>.</span>);
  }

  if (obj.fields['year'] || obj.fields['volume'] || obj.fields['number'] || obj.fields['pages']) {
    const issueParts = [];
    if (obj.fields['year']) {
      const year = obj.fields['year'];
      if (!(year instanceof StringValue)) throw new Error("Expected object to be instance of StringValue");
      issueParts.push(<span key="year" itemProp="datePublished" dateTime={year.toUnicode()}
                            className="_bib_year">{year.toUnicode()}</span>);
      if (obj.fields['volume'] || obj.fields['number']) issueParts.push(';');
    }
    if (obj.fields['volume']) {
      if (obj.fields['number']) issueParts.push('(');
      issueParts.push(renderVolume(obj.fields['volume'], journalId));
      if (obj.fields['number']) issueParts.push(')');
      if (obj.fields['pages']) issueParts.push(':');
    } else if (journalId) issueParts.push(<link itemProp="isPartOf" href={'#' + journalId}/>);
    if (obj.fields['pages'])  issueParts.push(renderPages(obj.fields['pages']));

    journalParts.push(
      <span key="journal_issue"
            itemProp="isPartOf"
            itemScope={true}
            itemType="http://schema.org/PublicationIssue">{issueParts}.</span>);
  }

  return (journalParts.length > 0)
    ? <span key="journal" className="_bib_journal">{intersperse(journalParts, ' ')}</span>
    : '';
}


function renderStringValueToString(obj) {
  if (!(obj instanceof StringValue))throw new Error("Object must be of type StringValue");
  return obj.toUnicode();
}

function renderUrl(urlValue) {
  const url = renderStringValueToString(urlValue);
  return <span key="url" className="_bib_url"><a itemProp="url" href={url}>{url}</a>.</span>;
}
function renderAccessDate(accessDate) {
  if (!accessDate.format) throw new Error("Access date must specify a format function");
  return <span key="accessdate" className="_bib_access_date">
    Accessed <span dateTime={accessDate.format('YYYY-MM-DD')}>
    {accessDate.format('MMMM D, YYYY')}
  </span>.</span>;
}
function renderTitle(title) {
  return <span key='title' className="_bib_title_wrapper"><cite className="_bib_title"
                                                                itemProp="name">{title.toUnicode()}</cite>.</span>;
}

function renderAuthorValue(obj) {
  if (!(obj instanceof AuthorValue)) throw new Error("Object must be of type AuthorValue");
  return <span key="authors" className="_bib_authors_wrapper">
    <span className="_bib_authors">{renderAuthors(obj.getAuthors())}</span>.</span>;
}

class Reference extends Component {
  renderArticleContents() {
    const obj = this.props.entry;
    const nameParts = [];

    if (obj.fields['author']) nameParts.push(renderAuthorValue(obj.fields['author']));
    if (obj.fields['title']) nameParts.push(renderTitle(obj.fields['title']));
    nameParts.push(renderJournal(obj));
    if (obj.fields['url']) nameParts.push(renderUrl(obj.fields['url']));
    if (obj.fields['urldate']) nameParts.push(renderAccessDate(obj.fields['urldate']));

    return intersperse(nameParts, ' ');
  }

  hasField(fieldName) {
    return this.props.entry.hasOwnProperty(fieldName) && (!!(this.props.entry[fieldName]));
  }

  render() {
    const obj = this.props.entry;
    const isEntry = (obj instanceof Entry);
    if (!isEntry) throw new Error("Object must be of type Entry: " + JSON.stringify(obj));

    let children = [];
    switch (obj.type) {
      case 'article':
        // todo Abbreviate the title of the journal according to the listing in PubMed.
        // Navarro P, Chambers I, Karwacki-Neisius V, et al. Molecular coupling of Xist regulation and pluripotency. Science. 2008;321(5896):1693-1695. http://www.sciencemag.org/cgi/content/full/321/5896/1693. Accessed June 4, 2009.
        // Porell F, Carter M. Discretionary hospitalization of nursing home residents with and without alzheimer’s disease: a multilevel analysis. J Aging Health. 2005;17(2):207-238.
        children = this.renderArticleContents();
        break;
      default:
        console.warn("WARNING: There is no styling yet for library types \"" + obj.type + "\". Assuming it behaves like @article.");
        console.warn("Please submit a feature request at https://github.com/digitalheir/bibliography-js/issues");
        children = this.renderArticleContents();
        break;
    }

    const props = {
      className: "_bib_citation _bib_" + obj.type,
      id: obj.id,
      itemScope: true,
      itemType: "https://schema.org/CreativeWork"
    };
    if (this.props.citation) props['itemProp'] = 'citation';
    return React.createElement(
      "span",
      props,
      children
    );
  }
}
Reference.propTypes = {
  entry: PropTypes.instanceOf(Entry).isRequired,
  citation: PropTypes.bool
};
export default Reference;
