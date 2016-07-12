// Generated automatically by nearley
// http://github.com/Hardmath123/nearley
function id(x) {return x[0]; }

var tok_id = {test: function(x) {return typeof x== 'object' && x.type=='id'; }}
var entry_type_bib = {test: function(x) {return typeof x== 'object' && x.type=='@bib'; }}
var entry_type_string = {test: function(x) {return typeof x== 'object' && x.type=='@string'; }}
var entry_type_preamble = {test: function(x) {return typeof x== 'object' && x.type=='@preamble'; }}
var entry_type_comment = {test: function(x) {return typeof x== 'object' && x.type=='@comment'; }}
var ws = {test: function(x) {return typeof x== 'object' && x.type=='ws';}}
var num = {test: function(x) {return x.constructor === Number || (typeof x== 'object'&&x.type == 'number')}}
var pound = {literal: '#' }
var eq = {literal: '=' }
var paren_l = {literal: '(' }
var paren_r = {literal: ')' }
var brace_l = {literal: '{' }
var brace_r = {literal: '}' }
var quote_dbl = {literal: '"' }
var comma = {literal: ',' }

function addToObj(obj, keyval){
  var key = keyval[0].toLowerCase();
      if(obj[key]) {
      console.log("WARNING: field "+key+ " was already defined on object "+obj._id+". Ignoring this value.");
      return;
    }else{
      obj[key]=keyval[1];
      return obj;
    }
}

function joinTokens(arr){
    var strs = [];
    for(var i=0;i<arr.length;i++){
      if(typeof arr[i] == 'object'){
        if(!arr[i].string) throw new Error("Expected token to have a string field called 'string' in object "+JSON.stringify(arr[i]));
        strs.push(arr[i].string);
      } else if(typeof arr[i] == 'string' || typeof arr[i] == 'number'){
        strs.push(arr[i]);
      } else throw new Error("Could not handle token "+JSON.stringify(arr[i]) +" in array "+JSON.stringify(arr));
    }
    return strs.join('');
}

export default {
    ParserRules: [
    {"name": "main$ebnf$1", "symbols": []},
    {"name": "main$ebnf$1$subexpression$1", "symbols": ["entry", "outside_entry"]},
    {"name": "main$ebnf$1", "symbols": ["main$ebnf$1$subexpression$1", "main$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "main", "symbols": ["outside_entry", "main$ebnf$1"], "postprocess": 
        function (data, location, reject) {
          var objs=[];
          if(data[0].length > 0) objs.push(data[0]);
          for(var i in data[1]){
           objs.push(data[1][i][0]);
           if(data[1][i][1].length > 0) objs.push(data[1][i][1]);
          }
          return objs;
        }
                                                         },
    {"name": "outside_entry$ebnf$1", "symbols": []},
    {"name": "outside_entry$ebnf$1", "symbols": ["non_entry", "outside_entry$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "outside_entry", "symbols": ["outside_entry$ebnf$1"], "postprocess":  function (data, location, reject) {
            var tokenz = [];
            for(var i=0;i<data[0].length;i++){
              if(typeof data[0][i] == 'string' || typeof data[0][i] == 'number' ) tokenz.push(data[0][i]);
              else if(data[0][i].string) tokenz.push(data[0][i].string);
              else if(data[0][i].length == 1) tokenz.push(data[0][i][0]);
              else throw new Error("Can't handle token "+JSON.stringify(data[0][i]));
            }
            return joinTokens(tokenz);
        }
                         },
    {"name": "_$ebnf$1", "symbols": [ws], "postprocess": id},
    {"name": "_$ebnf$1", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "_", "symbols": ["_$ebnf$1"]},
    {"name": "entry$subexpression$1", "symbols": ["entry_bib"]},
    {"name": "entry$subexpression$1", "symbols": ["entry_comment"]},
    {"name": "entry$subexpression$1", "symbols": ["entry_preamble"]},
    {"name": "entry$subexpression$1", "symbols": ["entry_string"]},
    {"name": "entry", "symbols": ["entry$subexpression$1"], "postprocess": function (data, location, reject) {return data[0][0];}},
    {"name": "entry_bib$ebnf$1", "symbols": []},
    {"name": "entry_bib$ebnf$1$subexpression$1", "symbols": ["keyval", "_", comma, "_"]},
    {"name": "entry_bib$ebnf$1", "symbols": ["entry_bib$ebnf$1$subexpression$1", "entry_bib$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "entry_bib$ebnf$2$subexpression$1", "symbols": ["_", comma]},
    {"name": "entry_bib$ebnf$2", "symbols": ["entry_bib$ebnf$2$subexpression$1"], "postprocess": id},
    {"name": "entry_bib$ebnf$2", "symbols": [], "postprocess": function(d) {return null;}},
    {"name": "entry_bib", "symbols": [entry_type_bib, "_", brace_l, "_", "refkey", "_", comma, "_", "entry_bib$ebnf$1", "keyval", "entry_bib$ebnf$2", "_", brace_r], "postprocess":  function (data, location, reject) {
            var obj = {
             _id: data[4],
             fields:{}
            };
            obj['@type'] = data[0].string;
            var keyvals = data[8];
            for(var kv=0;kv<keyvals.length;kv++) addToObj(obj.fields, keyvals[kv][0]);
            addToObj(obj.fields, data[9]);
            return obj;
        } },
    {"name": "entry_string", "symbols": [entry_type_string, "_", brace_l, "_", "keyval", "_", brace_r], "postprocess":  function (data, location, reject) {
            return {type: 'string', key: data[4][0], value: data[4][1]};
        } },
    {"name": "entry_preamble$ebnf$1", "symbols": ["non_closing_bracket"]},
    {"name": "entry_preamble$ebnf$1", "symbols": ["non_closing_bracket", "entry_preamble$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "entry_preamble", "symbols": [entry_type_preamble, brace_l, "entry_preamble$ebnf$1", brace_r]},
    {"name": "entry_comment", "symbols": [entry_type_comment, brace_l, "braced_comment", brace_r], "postprocess":  function (data, location, reject) {
          return {type: 'comment', data: data[2]};
        }
                                                                                   },
    {"name": "braced_comment$ebnf$1", "symbols": []},
    {"name": "braced_comment$ebnf$1$subexpression$1", "symbols": ["non_bracket"]},
    {"name": "braced_comment$ebnf$1$subexpression$1", "symbols": ["braced_comment"]},
    {"name": "braced_comment$ebnf$1", "symbols": ["braced_comment$ebnf$1$subexpression$1", "braced_comment$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "braced_comment", "symbols": [brace_l, "braced_comment$ebnf$1", brace_r], "postprocess":  function (data, location, reject) {
          var tkz = [];
          for(var i in data[1]) tkz.push(data[1][i][0]);
          return {type:'braced', data:tkz};
        }
                                                                               },
    {"name": "keyval", "symbols": ["key_string", "_", eq, "_", "value_string"], "postprocess": function (data, location, reject) {return [data[0], data[4]];}},
    {"name": "key_string$ebnf$1", "symbols": ["stringreftoken"]},
    {"name": "key_string$ebnf$1", "symbols": ["stringreftoken", "key_string$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "key_string", "symbols": ["key_string$ebnf$1"], "postprocess": function (data, location, reject) { return joinTokens(data[0]).toLowerCase(); }},
    {"name": "value_string$subexpression$1$ebnf$1", "symbols": []},
    {"name": "value_string$subexpression$1$ebnf$1$subexpression$1", "symbols": ["_", pound, "_", "quoted_string_or_ref"]},
    {"name": "value_string$subexpression$1$ebnf$1", "symbols": ["value_string$subexpression$1$ebnf$1$subexpression$1", "value_string$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "value_string$subexpression$1", "symbols": ["quoted_string_or_ref", "value_string$subexpression$1$ebnf$1"]},
    {"name": "value_string$subexpression$1", "symbols": ["braced_string"]},
    {"name": "value_string$subexpression$1", "symbols": [num]},
    {"name": "value_string", "symbols": ["value_string$subexpression$1"], "postprocess":  function (data, location, reject) {
        //console.log("DATA",JSON.stringify(data));
             var match = data[0];
             if(match.length == 2){
              // quoted string
              var tokenz = [];
              tokenz.push(match[0]);
              for(var i=0;i<match[1].length;i++) tokenz.push(match[1][i][3]);
              return tokenz;
             } else return match;
         }
                              },
    {"name": "braced_string", "symbols": ["braced_comment"], "postprocess": function (data, location, reject) { return data[0]; }},
    {"name": "quoted_string_or_ref$subexpression$1", "symbols": ["quoted_string"]},
    {"name": "quoted_string_or_ref$subexpression$1", "symbols": ["string_ref"]},
    {"name": "quoted_string_or_ref", "symbols": ["quoted_string_or_ref$subexpression$1"], "postprocess":  function (data, location, reject) {
          //console.log(data);
          if (data[0][0].type=='quotedstring') return data[0][0].data;
          else{return data[0][0];}
        }
                                                             },
    {"name": "quoted_string$ebnf$1", "symbols": []},
    {"name": "quoted_string$ebnf$1$subexpression$1", "symbols": ["escaped_quote"]},
    {"name": "quoted_string$ebnf$1$subexpression$1", "symbols": ["non_quote_dbl"]},
    {"name": "quoted_string$ebnf$1$subexpression$1", "symbols": ["braced_string"]},
    {"name": "quoted_string$ebnf$1", "symbols": ["quoted_string$ebnf$1$subexpression$1", "quoted_string$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "quoted_string", "symbols": [quote_dbl, "quoted_string$ebnf$1", quote_dbl], "postprocess":  function (data, location, reject) {
          var tks = [];
          for(var i in data[1]) tks.push(data[1][i][0]);
          return {type:'quotedstring', data:tks};
        }
                                },
    {"name": "escaped_quote", "symbols": [brace_l, quote_dbl, brace_r], "postprocess": function (data, location, reject) { return '"'; }},
    {"name": "string_ref$subexpression$1$ebnf$1", "symbols": []},
    {"name": "string_ref$subexpression$1$ebnf$1", "symbols": ["stringreftoken", "string_ref$subexpression$1$ebnf$1"], "postprocess": function arrconcat(d) {return [d[0]].concat(d[1]);}},
    {"name": "string_ref$subexpression$1", "symbols": ["stringreftoken_n_num", "string_ref$subexpression$1$ebnf$1"]},
    {"name": "string_ref", "symbols": ["string_ref$subexpression$1"], "postprocess": function (data, location, reject) { var str = data[0][0]+joinTokens(data[0][1]); return {stringref: str}; }},
    {"name": "refkey$subexpression$1", "symbols": [paren_l]},
    {"name": "refkey$subexpression$1", "symbols": [paren_r]},
    {"name": "refkey$subexpression$1", "symbols": [tok_id]},
    {"name": "refkey$subexpression$1", "symbols": [num]},
    {"name": "refkey$subexpression$1", "symbols": [entry_type_bib]},
    {"name": "refkey$subexpression$1", "symbols": [entry_type_string]},
    {"name": "refkey$subexpression$1", "symbols": [entry_type_preamble]},
    {"name": "refkey$subexpression$1", "symbols": [entry_type_comment]},
    {"name": "refkey$subexpression$1", "symbols": [pound]},
    {"name": "refkey", "symbols": ["refkey$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [paren_l]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [paren_r]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [tok_id]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [ws]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [num]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [comma]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [entry_type_bib]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [entry_type_string]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [entry_type_preamble]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [entry_type_comment]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [pound]},
    {"name": "non_quote_dbl$subexpression$1", "symbols": [eq]},
    {"name": "non_quote_dbl", "symbols": ["non_quote_dbl$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [paren_l]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [paren_r]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [tok_id]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [ws]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [num]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [comma]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [brace_l]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [brace_r]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [entry_type_bib]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [entry_type_string]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [entry_type_preamble]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [entry_type_comment]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [pound]},
    {"name": "non_closing_bracket$subexpression$1", "symbols": [eq]},
    {"name": "non_closing_bracket", "symbols": ["non_closing_bracket$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}},
    {"name": "non_bracket$subexpression$1", "symbols": [paren_l]},
    {"name": "non_bracket$subexpression$1", "symbols": [paren_r]},
    {"name": "non_bracket$subexpression$1", "symbols": [tok_id]},
    {"name": "non_bracket$subexpression$1", "symbols": [ws]},
    {"name": "non_bracket$subexpression$1", "symbols": [num]},
    {"name": "non_bracket$subexpression$1", "symbols": [comma]},
    {"name": "non_bracket$subexpression$1", "symbols": [brace_r]},
    {"name": "non_bracket$subexpression$1", "symbols": [entry_type_bib]},
    {"name": "non_bracket$subexpression$1", "symbols": [entry_type_string]},
    {"name": "non_bracket$subexpression$1", "symbols": [entry_type_preamble]},
    {"name": "non_bracket$subexpression$1", "symbols": [entry_type_comment]},
    {"name": "non_bracket$subexpression$1", "symbols": [pound]},
    {"name": "non_bracket$subexpression$1", "symbols": [eq]},
    {"name": "non_bracket", "symbols": ["non_bracket$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}},
    {"name": "stringreftoken$subexpression$1", "symbols": [paren_l]},
    {"name": "stringreftoken$subexpression$1", "symbols": [paren_r]},
    {"name": "stringreftoken$subexpression$1", "symbols": [tok_id]},
    {"name": "stringreftoken$subexpression$1", "symbols": [num]},
    {"name": "stringreftoken$subexpression$1", "symbols": [entry_type_bib]},
    {"name": "stringreftoken$subexpression$1", "symbols": [entry_type_string]},
    {"name": "stringreftoken$subexpression$1", "symbols": [entry_type_preamble]},
    {"name": "stringreftoken$subexpression$1", "symbols": [entry_type_comment]},
    {"name": "stringreftoken", "symbols": ["stringreftoken$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [paren_l]},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [paren_r]},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [tok_id]},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_bib]},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_string]},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_preamble]},
    {"name": "stringreftoken_n_num$subexpression$1", "symbols": [entry_type_comment]},
    {"name": "stringreftoken_n_num", "symbols": ["stringreftoken_n_num$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}},
    {"name": "non_entry$subexpression$1", "symbols": [paren_l]},
    {"name": "non_entry$subexpression$1", "symbols": [paren_r]},
    {"name": "non_entry$subexpression$1", "symbols": [tok_id]},
    {"name": "non_entry$subexpression$1", "symbols": [ws]},
    {"name": "non_entry$subexpression$1", "symbols": [num]},
    {"name": "non_entry$subexpression$1", "symbols": [comma]},
    {"name": "non_entry$subexpression$1", "symbols": [eq]},
    {"name": "non_entry$subexpression$1", "symbols": [brace_l]},
    {"name": "non_entry$subexpression$1", "symbols": [brace_r]},
    {"name": "non_entry$subexpression$1", "symbols": [pound]},
    {"name": "non_entry", "symbols": ["non_entry$subexpression$1"], "postprocess": function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }}}
]
  , ParserStart: "main"
}
