import Lexer from '../lexer'


var l=new Lexer(":    abc  \\@ escaped \\@ escaped @ loooll   \\{ escaped {therest, k }DFSA ");

var token;
while(token = l.readNextToken()){
  console.log(token);
};
