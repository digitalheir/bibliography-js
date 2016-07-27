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
is automatically converted to `ö`, but general LaTeX commands are currently not processed.

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
```js
    import Bibliography, {parseString, AMA} from 'bibliography'

    const Reference = AMA.Reference;

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

    const markup = ReactDOMServer.renderToStaticMarkup(<Reference entry={bibliography.entries['navarro2008molecular']}/>);
    console.log(markup);
```

## License
MIT
