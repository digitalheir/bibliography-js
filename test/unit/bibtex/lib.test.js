import {assert, expect} from 'chai';
import Lexer from '../../../src/bibtex/lexer/lexer';
import StringValue from '../../../src/bibtex/string_value/StringValue';
import grammar from '../../../src/bibtex/parser/parser';
import nearley from 'nearley';
import Bibliography from '../../../src/bibtex/Bibliography'
//mocha --compilers js:babel-core/register

describe('BiBTeX', () => {
  const COMMENT_PART = "\n\n\nthisisallacommentof{}commentswitheverythingexceptan\", whichweca123nescapewitha";
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
        "    auTHor    = \"Goossens, jr, Mich{\\`e}l and \" # mittelbach # \" and \"#\"{ {   A}}le\"#\"xander de La Samarin \",\n" +
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
      bibliography.entries.comp4nion.fields.author._authors.forEach((author)=>{
      console.log(JSON.stringify(author));
      });
      //assert.equal(bibliography.strings.mittelbach.toUnicode(), "Mittelbach, Franck");
      //assert.equal(bibliography.entries.companion.fields.author.toUnicode(), "Goossens, Michel and Mittelbach, Franck and Samarin, Alexander");

    });
    //
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
