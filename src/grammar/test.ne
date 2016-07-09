@{%
var print_tok  = {literal: "print"};
var number_tok = {test: function(x) {return x.constructor === Number; }}
%}

main -> %print_tok %number_tok
