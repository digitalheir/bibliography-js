import Lexer from './lexer/lexer'
import Bibliography from './../bibliography/Bibliography'
import grammar from './parser/parser';
import nearley from 'nearley';


/**
 * @param str Bibliography file that should conform to BibTex standard
 * @return Bibliography the parsed bibliography
 */
export function parseString(str) {
  // Tokenize string
  let tokens = [];
  const lexer = new Lexer(str);
  let nextToken;
  while (nextToken = lexer.readNextToken()) tokens.push(nextToken);

  // Parse tokens
  const parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  parser.feed(tokens);
  const result = parser.results;

  if (result.length <= 0) throw new Error("Found 0 parses for input string.");
  else if (result.length > 1) console.warn("Found multiple parses for input string. This is a bug. Please report this issue to https://github.com/digitalheir/bibliography-js/issues");
  return new Bibliography(result[0]);
}
