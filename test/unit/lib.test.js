import {assert, expect} from 'chai';
import Lexer from '../../src/bibtex/lexer';
import grammar from '../../test';
import nearley from 'nearley';

//mocha --compilers js:babel-core/register

describe('BiBTeX', () => {
  const COMMENT_PART = "\n\n\nthisisallacommentof{}commentswitheverythingexceptan\\@, whichweca123nescapewitha\\\\";
  describe('lexer', () => {
    let tokens = [];
    const lexer1 = new Lexer(COMMENT_PART + // todo what last char -> loop bugfix
      // " @  STRiNG   {  mittelbach = \"Mittelbach, Franck\" }" +
      // " @  book   {   \n companion    ,\n" +
      // "    auTHor    = \"Goossens, Michel and \" # mittelback # \" and Samarin, Alexander\",\n" +
      // "    titLe     = \"The {{\\LaTeX}} {C}ompanion\"," +
      // "publisher     = \"Addison-Wesley\",\n" +
      // "    yeaR      = 1993,\n" +
      // "    Title     = {{Bib}\\TeX}" +
      // "    Title2    = \"{Bib}\\TeX\"" +
      // "    Title3    = \"{Bib}\" # \"\\TeX\"" +
      // "}" +
      ""
    );

    it('should lex', function () {
      let nextToken;
      while (nextToken = lexer1.readNextToken()) {
        tokens.push(nextToken)
      }
      // console.log(tokens);
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
      // for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      assert.equal(parse[0], COMMENT_PART
        .replace(/\\@/g, '@')
        .replace(/\\\\/g, '\\')
      );
    });
    it('should parse string entries', function () {
      let tokens = [];
      const lexer1 = new Lexer("leading comment@   STRiNG   {  mittelbach = \"Mittelbach, Franck\"  }");
        //       " @  book   {   \n companion    ,\n" +
        // "    auTHor    = \"Goossens, Michel and \" # mittelback # \" and Samarin, Alexander\",\n" +
        // "    titLe     = \"The {{\\LaTeX}} {C}ompanion\"," +
        // "publisher     = \"Addison-Wesley\",\n" +
        // "    yeaR      = 1993,\n" +
        // "    Title     = {{Bib}\\TeX}" +
        // "    Title2    = \"{Bib}\\TeX\"" +
        // "    Title3    = \"{Bib}\" # \"\\TeX\"" +
        // "}");
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      // for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      console.log(JSON.stringify(res[0]))
      // assert.equal(parse[0].type, 'string');
      // assert.equal(parse[0].key, "mittelbach");
      // assert.equal(parse[0].value, ["Mittelbach, Franck"]);
    });
    it('should parse bib entries', function () {
      let tokens = [];
      const lexer1 = new Lexer("@b00k"+
            "{companion," +
      // "    auTHor    = \"Goossens, Michel and \" # mittelback # \" and Samarin, Alexander\",\n" +
      // "    titLe     = \"The {{\\LaTeX}} {C}ompanion\"," +
      "publisher     = \"Addison-Wesley\",\n" +
      "yeaR=1993 ," +
      // "    Title     = {{Bib}\\TeX}" +
      // "    Title2    = \"{Bib}\\TeX\"" +
      // "    Title3    = \"{Bib}\" # \"\\TeX\"" +
      "}");
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      // assert.equal(res.length, 1);
      const parse = res[0];
      // console.log(JSON.stringify(res[0]))
      // assert.equal(parse[0].type, 'string');
      // assert.equal(parse[0].key, "mittelbach");
      // assert.equal(parse[0].value, ["Mittelbach, Franck"]);
    });
  });
})
;
