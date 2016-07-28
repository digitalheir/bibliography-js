# bibliography

![Build Status](https://img.shields.io/travis/digitalheir/bibliography.svg)
![Coverage](https://img.shields.io/coveralls/digitalheir/bibliography.svg)
![Downloads](https://img.shields.io/npm/dm/bibliography.svg)
![Downloads](https://img.shields.io/npm/dt/bibliography.svg)
![npm version](https://img.shields.io/npm/v/bibliography.svg)
![dependencies](https://img.shields.io/david/digitalheir/bibliography.svg)
![dev dependencies](https://img.shields.io/david/dev/digitalheir/bibliography.svg)
![License](https://img.shields.io/npm/l/bibliography.svg)

Library for parsing and rendering bibliographic entities.

The library can parse [BiBTeX](http://www.bibtex.org/) files and render them to [React](https://facebook.github.io/react/) components.
Some light processing is done, such as replacing special characters with their Unicode equivalent (for example, `{\"o}`
is automatically converted to `ö`), but general LaTeX commands are currently not processed.

## Getting Started

Install it via npm:

```shell
npm install bibliography
```

And include in your project:

```javascript
import bibliography from 'bibliography';
```

## Usage
To render the following AMA style reference:

<span class="_bib_citation _bib_ama _bib_article" id="navarro2008molecular" itemscope="" itemtype="https://schema.org/CreativeWork"><span class="_bib_authors_wrapper"><span class="_bib_authors"><span itemprop="author" itemscope="" itemtype="https://schema.org/Person" class="_bib_author"><span itemprop="name"><span itemprop="familyName">Navarro</span> P</span></span>, <span itemprop="author" itemscope="" itemtype="https://schema.org/Person" class="_bib_author"><span itemprop="name"><span itemprop="familyName">Chambers</span> I</span></span>, <span itemprop="author" itemscope="" itemtype="https://schema.org/Person" class="_bib_author"><span itemprop="name"><span itemprop="familyName">Karwacki-Neisius</span> V</span></span>, et al</span>.</span> <span class="_bib_title_wrapper"><cite class="_bib_title" itemprop="name">Molecular coupling of Xist regulation and pluripotency</cite>.</span> <span class="_bib_journal"><span><cite itemscope="" itemtype="https://schema.org/Periodical" itemid="#_bib_journal_Science" class="_bib_journal"><span itemprop="name">Science</span></cite>.</span> <span itemprop="isPartOf" itemscope="" itemtype="http://schema.org/PublicationIssue"><span itemprop="datePublished" datetime="2008" class="_bib_year">2008</span>;(<span itemprop="isPartOf" itemscope="" itemtype="https://schema.org/PublicationVolume" class="_bib_volume"><span itemprop="volumeNumber">321</span><link itemprop="isPartOf" href="#_bib_journal_Science"/></span>):<span class="_bib_pages"><span itemprop="pageStart">1693</span>-<span itemprop="pageEnd">1695</span></span>.</span></span> <span class="_bib_url"><a itemprop="url" href="http://www.sciencemag.org/cgi/content/full/321/5896/1693">http://www.sciencemag.org/cgi/content/full/321/5896/1693</a>.</span> <span class="_bib_access_date">Accessed <span datetime="2009-06-04">June 4, 2009</span>.</span></span>

```js
    import React from 'react'
    import Bibliography, {parseString} from 'bibliography'
    import AMA from 'bibliography/AMA'

    // file.bib
    var bib_article = "@article{navarro2008molecular,\n"
        + "title={Molecular coupling of Xist regulation and pluripotency},\n"
        + "author={Navarro, Pablo and Chambers, Ian and Karwacki-Neisius, Violetta and Chureau, Corinne and Morey, C{\'e}line and Rougeulle, Claire and Avner, Philip},\n"
        + "journal={Science},\n"
        + "volume={321},\n"
        + "number={5896},\n"
        + "pages={1693--1695},\n"
        + "year={2008},\n"
        + "url={http://www.sciencemag.org/cgi/content/full/321/5896/1693},\n"
        + "urldate={2009-06-04},\n"
        + "publisher={American Association for the Advancement of Science}\n"
        + "}";
    // Parse bibliography string
    const bibliography = parseString(bib_article);

    const markup = ReactDOMServer.renderToStaticMarkup(<AMA entry={bibliography.entries['navarro2008molecular']}/>);

    // Renders <span class="_bib_citation _bib_ama _bib_article" id="navarro2008molecular" itemscope="" itemtype="https://schema.org/CreativeWork"><span class="_bib_authors_wrapper"><span class="_bib_authors"><span itemprop="author" itemscope="" itemtype="https://schema.org/Person" class="_bib_author"><span itemprop="name"><span itemprop="familyName">Navarro</span> P</span></span>, <span itemprop="author" itemscope="" itemtype="https://schema.org/Person" class="_bib_author"><span itemprop="name"><span itemprop="familyName">Chambers</span> I</span></span>, <span itemprop="author" itemscope="" itemtype="https://schema.org/Person" class="_bib_author"><span itemprop="name"><span itemprop="familyName">Karwacki-Neisius</span> V</span></span>, et al</span>.</span> <span class="_bib_title_wrapper"><cite class="_bib_title" itemprop="name">Molecular coupling of Xist regulation and pluripotency</cite>.</span> <span class="_bib_journal"><span><cite itemscope="" itemtype="https://schema.org/Periodical" itemid="#_bib_journal_Science" class="_bib_journal"><span itemprop="name">Science</span></cite>.</span> <span itemprop="isPartOf" itemscope="" itemtype="http://schema.org/PublicationIssue"><span itemprop="datePublished" datetime="2008" class="_bib_year">2008</span>;(<span itemprop="isPartOf" itemscope="" itemtype="https://schema.org/PublicationVolume" class="_bib_volume"><span itemprop="volumeNumber">321</span><link itemprop="isPartOf" href="#_bib_journal_Science"/></span>):<span class="_bib_pages"><span itemprop="pageStart">1693</span>-<span itemprop="pageEnd">1695</span></span>.</span></span> <span class="_bib_url"><a itemprop="url" href="http://www.sciencemag.org/cgi/content/full/321/5896/1693">http://www.sciencemag.org/cgi/content/full/321/5896/1693</a>.</span> <span class="_bib_access_date">Accessed <span datetime="2009-06-04">June 4, 2009</span>.</span></span>
    console.log(markup);
```

## License
MIT
