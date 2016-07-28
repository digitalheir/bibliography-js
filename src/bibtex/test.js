// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
function id(x) {return x[0]; }
export default {
    ParserRules: [
    {"name": "ne$ebnf$1", "symbols": [/./]},
    {"name": "ne$ebnf$1", "symbols": [/./, "ne$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "ne", "symbols": ["ne$ebnf$1"]}
]
  , ParserStart: "ne"
};

