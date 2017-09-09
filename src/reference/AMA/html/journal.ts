import {BibliographyItem} from "../../../bibliography/Bibliography";
import {RE_WHITESPACE} from "../../../../src2/util";
import {getPageStart, isPageRange, PageRange} from "../../../bibliography/fields/PageRange";


function renderPages(pages: PageRange) {
  const children = [span("_bib_pages_start",
    {prop: "pageStart"},
    getPageStart(pages))];
  if (isPageRange(pages)) {
    children.push("-", span("_bib_pages_end", {prop: "pageEnd"}, pages[1]));
  }
  return span("_bib_pages", {}, ...children);
}

function renderVolume(vol, partOfId?: string) {
  return span("_bib_volume", {
      prop: "isPartOf",//    itemType="https://schema.org/PublicationVolume"
    },
    span("_bib_volume_number", {prop: "isPartOf"}, vol)
  );
  // todo // {(!!partOfId) ? <link itemProp="isPartOf" href={'#' + partOfId}/> : ''}
}

let spanJournalName = journalName => span(
  "_bib_journal" + "_name",
  {prop: "name"},
  journalName
) + ".";

const spanYear = (year: string) => span("_bib_journal_year",
  {
    prop: "datePublished",
    "date-time": year
  },
  year
);

let pushJournalIssueDetails = function (item: BibliographyItem, journalId: string | undefined, journalParts: string[]) {
  const year = item['year'];
  const volume = item['volume'];
  const number = item['number'];
  const pages = item['pages'];
  if (year || volume || number || pages) {
    const issueParts: string[] = [];
    if (year) {
      issueParts.push(spanYear(year));
      if (volume || number) issueParts.push(';');
    }
    if (volume) {
      if (number) issueParts.push('(');
      issueParts.push(renderVolume(volume, journalId));
      if (number) issueParts.push(')');
      if (pages) issueParts.push(':');
    }
    // TODO
    /* else if (journalId) issueParts.push(<link itemProp = "isPartOf"
    href = {'#' +journalId}
    />);*/
    if (pages) issueParts.push(renderPages(pages));
    journalParts.push(issueParts.join(""))
  }
};


export const pushJournalDetails = (item: BibliographyItem, parts: string[]) => {
  const journal = renderJournalDetailsToHtml(item);
  if (!!journal) parts.push(journal);
};
/**
 * todo Abbreviate the title of the journal according to the listing in PubMed.
 *
 * For example:
 * Science. 2008;321(5896):1693-1695.
 *
 */
function renderJournalDetailsToHtml(item: BibliographyItem): string {
  const journalParts: string[] = [];

  const journalName = item["journal"];
  const journalId = journalName ? ("_bib_journal" +
    "_" + journalName.replace(RE_WHITESPACE, "_")) : undefined;
  const journalProps: { [k: string]: string } = {
    // todo
    //prop:"https://schema.org/Periodical"
  };
  if (journalId) {
    journalParts.push(spanJournalName(journalName));
    journalProps["id"] = journalId;
  }
  pushJournalIssueDetails(item, journalId, journalParts);
  return span("_bib_journal", journalProps, ...journalParts);
}
