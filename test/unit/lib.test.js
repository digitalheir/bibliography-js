import {assert, expect} from 'chai';
import Lexer from '../../src/bibtex/lexer/lexer';
import grammar from '../../src/bibtex/parser/parser';
import nearley from 'nearley';
import Bibliography from '../../src/bibtex/Bibliography'
//mocha --compilers js:babel-core/register

describe('BiBTeX', () => {
  const COMMENT_PART = "\n\n\nthisisallacommentof{}commentswitheverythingexceptan\\@, whichweca123nescapewitha\\\\";
  describe('lexer', () => {
    let tokens = [];
    const lexer1 = new Lexer(COMMENT_PART +
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
      const lexer1 = new Lexer("leading comment" +
        "@   STRiNG   {  mittelbach = \"Mittelbach, Franck\"  }" +

        "@string{acab= a #_# c #_#\"are\" #_# b}"+
        "@string{c = \"co\"#cc}"+
        "@string{a = \"a\"#l#l}"+
        "@string{_ = \" \"}"+
        "@string{l = {l}}"+
        "@string{cc ={mp{\\\"u}ters}}"+
        "@string{b =  \"beautifu\"#l}"
      );
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      // for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      //console.log(JSON.stringify(res[0]));
      assert.equal(parse[1].type, 'string');
      assert.equal(parse[1].key, "mittelbach");

      let bibliography = new Bibliography(parse);
      
      assert.equal(bibliography.strings.acab, "all computers are beautiful");
    });
    it('should parse bib entries', function () {
      let tokens = [];
      const lexer1 = new Lexer(" @  STRiNG   {  mittelbach = \"Mittelbach, Franck\" }"+
        "some comment " +
        "@b00k"+
            "{ companion  ," +
      "    auTHor    = \"Goossens, Michel and \" # mittelbach # \" and Samarin, Alexander\",\n" +
      "    titLe     = \"The {{\\LaTeX}} {C}{\\\"o}mp{\\\"a}nion\"," +
      "publisher     = \"Addison-Wesley\",\n" +
      "yeaR=1993 ," +
      "    Title     = {{Bib}\\TeX}," +
      "    title     = {{Bib}\\TeX}," +
      "    Title2    = \"{Bib}\\TeX\"," +
      "    Title3    = \"{Bib}\" # \"\\TeX\"" +
      "}");
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      p.feed(tokens);
      var res = p.results;
      //for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      assert.equal(res.length, 1);
      const parse = res[0];
      // for (var i = 0; i < parse.length; i++) console.log(i, JSON.stringify(parse[i]));
      // console.log(JSON.stringify(res[0]))
      assert.equal(parse[0], ' ');
      assert.equal(parse[1].key, "mittelbach");
      // assert.equal(parse[1].value[0], ["Mittelbach",","," ","Franck"]);
      assert.equal(parse[1].value[0][3], "Franck");

      let bibliography = new Bibliography(parse);
      // console.log(JSON.stringify(bibliography.entries))
      assert.equal(bibliography.entries.companion.fields.author, "Goossens, Michel and Mittelbach, Franck and Samarin, Alexander");
      
    });

    it('should parse preamble entries', function () {
      let tokens = [];//todo
      const lexer1 = new Lexer("@preamble"+
        "{blablabla }");
      let nextToken;
      while (nextToken = lexer1.readNextToken())  tokens.push(nextToken);
      // for (var t = 0; t < tokens.length; t++) console.log(t, JSON.stringify(tokens[t]));
      var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
      // p.feed(tokens);
      // var res = p.results;
      // for (var i = 0; i < res.length; i++) console.log(i, JSON.stringify(res[i]));
      // assert.equal(res.length, 1);
      // const parse = res[0];
      // console.log(JSON.stringify(res[0]))
      // assert.equal(parse[0].type, 'string');
      // assert.equal(parse[0].key, "mittelbach");
    });
  });
})
;
