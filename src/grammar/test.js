// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
(function () {
function id(x) {return x[0]; }

var print_tok  = {literal: "print"};
var number_tok = {test: function(x) {return x.constructor === Number; }}
var grammar = {
    ParserRules: [
    {"name": "main", "symbols": [print_tok, number_tok]}
]
  , ParserStart: "main"
}
if (typeof module !== 'undefined'&& typeof module.exports !== 'undefined') {
   module.exports = grammar;
} else {
   window.grammar = grammar;
}
})();
