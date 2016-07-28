import React, {PropTypes, Component} from 'react';
import {assert, expect} from 'chai';
import Lexer from '../../../src/internal/bibtex/lexer/lexer';
import StringValue from '../../../src/internal/bibtex/field_value/StringValue';
import grammar from '../../../src/internal/bibtex/parser/parser';
import nearley from 'nearley';
import Bibliography from '../../../src/internal/bibliography/Bibliography'
//mocha --compilers js:babel-core/register
import referenceFormats from  '../../../src/internal/bibliography/ReferenceFormats'
import {parseString} from  '../../../src/internal/bibtex/bibtex'
import ReactDOMServer  from 'react-dom/server'
import Entry from '../../../src/internal/reference/AMA/Reference';
import MLA from '../../../src/internal/reference/MLA/Parenthetical';

describe('BiBTeX', () => {
  // @article
  //  Required:         author, title, journal, year.
  //  Optional fields:  volume, number, pages, month, note.
  const bib_article = "@article{navarro2008molecular,\n"
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
  describe('MLA', () => {
    const bibliography = parseString(bib_article);

    const markup = ReactDOMServer.renderToStaticMarkup(
      <MLA entry={bibliography.entries['navarro2008molecular']}/>
    );
    //console.log(markup);
    const str = markup.toString().replace(/<[^>]+>/g, "").trim().toString();

    // console.log("(Navarro et al. 1693-1695)"==str);
    assert.equal(str, "(Navarro et al. 1693-1695)");
  });
  describe('AMA', () => {
    it('should render a @article', function () {
      const bibliography = parseString(bib_article);

      const markup = ReactDOMServer.renderToStaticMarkup(
        <Entry entry={bibliography.entries['navarro2008molecular']}/>
      );
      console.log(markup);
      console.log(markup.replace(/<[^>]+>/g, ''));
      assert(markup.replace(/<[^>]+>/g, ''),
        "Navarro P, Chambers I, Karwacki-Neisius V, et al. " +
        "Molecular coupling of Xist regulation and pluripotency. " +
        "Science. 2008;(321):1693-1695. " +
        "http://www.sciencemag.org/cgi/content/full/321/5896/1693. Accessed June 4, 2009.");
    });
  });


  const COMMENT_PART = "\n\n\nthisisallacommentof{}commentswitheverythingexceptan\", whichweca123nescapewitha";

  //TODO test crossref
  describe('lexer', () => {
    let tokens = [];
    const lexer1 = new Lexer(COMMENT_PART +
      ""
    );

    //it('should resolve string references like we expect', function () {
    //const stringVals = StringValue.resolveStrings(
    //  {
    //    "mittelbach": {
    //      "type": "quotedstringwrapper",
    //      "data": [{
    //        "type": "quotedstring",
    //        "data": [[[{"type": "id", "string": "Mittelbach"}]], [[","]], [[{
    //          "type": "ws",
    //          "string": " "
    //        }]], [[{"type": "id", "string": "Franck"}]]]
    //      }]
    //    },
    //    "acab": {
    //      "type": "quotedstringwrapper",
    //      "data": [{"stringref": "a"}, {"stringref": "_"}, {"stringref": "c"}, {"stringref": "_"}, {
    //        "type": "quotedstring",
    //        "data": [[[{"type": "id", "string": "are"}]]]
    //      }, {"stringref": "_"}, {"stringref": "b"}]
    //    },
    //    "c": {
    //      "type": "quotedstringwrapper",
    //      "data": [{"type": "quotedstring", "data": [[[{"type": "id", "string": "co"}]]]}, {"stringref": "cc"}]
    //    },
    //    "a": {
    //      "type": "quotedstringwrapper",
    //      "data": [{
    //        "type": "quotedstring",
    //        "data": [[[{"type": "id", "string": "a"}]]]
    //      }, {"stringref": "l"}, {"stringref": "l"}]
    //    },
    //    "_": {
    //      "type": "quotedstringwrapper",
    //      "data": [{"type": "quotedstring", "data": [[[{"type": "ws", "string": " "}]]]}]
    //    },
    //    "l": {"type": "bracedstringwrapper", "data": ["l"]},
    //    "cc": {"type": "bracedstringwrapper", "data": ["mp", {"type": "braced", "data": ["\\", "\"", "u"]}, "ters"]},
    //    "b": {
    //      "type": "quotedstringwrapper",
    //      "data": [{"type": "quotedstring", "data": [[[{"type": "id", "string": "beautifu"}]]]}, {"stringref": "l"}]
    //    }
    //  }
    //);
    //console.log(JSON.stringify(withoutRefs));
    //});

    it('should lex', function () {
      let nextToken;
      while (nextToken = lexer1.readNextToken()) {
        tokens.push(nextToken);
        //console.log(nextToken);
      }
    });
  });
  describe('parser', () => {
    it('should parse comments', function () {
      let tokens = [];
      const lexer1 = new Lexer(COMMENT_PART);
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      //for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      //console.log(JSON.stringify(parse))
      assert.equal(parse.comments[0][2], '{');
    });
    it('should parse string entries', function () {
      let tokens = [];
      const trema = "\"";
      const lexer1 = new Lexer("leading comment" +
        "@   STRiNG   {  mittelbach = \"Mittelbach, Franck\"  }" +
        "@string{acab= a #_# c #_#\"are\" #_# b}" +
        "@string{c = \"co\"#cc}" +
        "@string{a = \"a\"#l#l}" +
        "@string{_ = {{{{{ }}}}}}" +
        "@string{l   =   {l}}    " +
        "@string{cc ={mp{\\" + trema + "u}ters}}" +
        "@string{b =  \"beautifu\"#l}"
      );
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      //for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      assert.equal(parse.entries[0].type, 'string');
      assert.equal(parse.entries[0].data.key, "mittelbach");

      let bibliography = new Bibliography(parse);
      assert.equal(bibliography.strings.acab.toUnicode(), "all compüters are beautiful");
    });
    it('should parse bib entries', function () {
      let tokens = [];
      const lexer1 = new Lexer(" @  STRiNG   {  mittelbach = \"Mittelbach, Franck\" }" +
        "some comment " +
        "@b00k" +
        "{ comp4nion  ," +
        "    auTHor    = \"Goossens, jr, Mich{\\`e}l Frederik and \" # mittelbach # \" and \"#\"{ {   A}}le\"#\"xander de La Samarin \",\n" +
        "    titLe     = \"The {{\\LaTeX}} {C}{\\\"o}mp{\\\"a}nion\"," +
        //"publisher     = \"Addison-Wesley\",\n" +
        "yeaR=1993 ," +
        //"    Title     = {{Bib}\\TeX}," +
        //"    title     = {{Bib}\\TeX}," +
        //"    Title2    = \"{Bib}\\TeX\"," +
        //"    Title3    = \"{Bib}\" # \"\\TeX\"" +
        "}");
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      //for (var t = 0; t < tokens.length; t++) conslog(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      //for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      // for (var i = 0; i < parse.length; i++) console.log(i, JSON.stringify(parse[i]));
      //console.log(JSON.stringify("PARSE", parse));

      let bibliography = new Bibliography(parse);
      bibliography.entries.comp4nion.fields.author._authors.forEach((author)=> {
      });
      assert.equal(bibliography.strings.mittelbach.toUnicode(), "Mittelbach, Franck");
    });
    //it('should parse preamble entries', function () {
    //  let tokens = [];//todo
    //  const lexer1 = new Lexer("@preamble"+
    //    "{blablabla }");
    //  let nextToken;
    //  while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
    //  // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
    //  var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
    //  // p.feed(tokens);
    //  // var res = p.results;
    //  // for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
    //  // assert.equal(res.length, 1);
    //  // const parse = res[0];
    //  // console.log(JSON.stringify(res[0]))
    //  // assert.equal(parse[0].type, 'string');
    //  // assert.equal(parse[0].key, "mittelbach");
    //});
  });
})
;
