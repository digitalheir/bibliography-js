# For more information, see:
#     http://ftp.math.purdue.edu/mirrors/ctan.org/info/bibtex/tamethebeast/ttb_en.pdf
#     http://artis.imag.fr/~Xavier.Decoret/resources/xdkbibtex/bibtex_summary.html
#     http://www.bibtex.org/Format/

@{%
var tok_id = {test: function(x) {return typeof x== 'object' && x.type=='id'; }}
var entry_type_bib = {test: function(x) {return typeof x== 'object' && x.type=='@bib'; }}
var entry_type_string = {test: function(x) {return typeof x== 'object' && x.type=='@string'; }}
var entry_type_preamble = {test: function(x) {return typeof x== 'object' && x.type=='@preamble'; }}
var entry_type_comment = {test: function(x) {return typeof x== 'object' && x.type=='@comment'; }}
var ws = {test: function(x) {return typeof x== 'object' && x.type=='ws';}}
var num = {test: function(x) {return x.constructor === Number || (typeof x== 'object'&&x.type == 'number')}}
var pound = {literal: '#' }
var eq = {literal: '=' }
var brace_l = {literal: '{' }
var brace_r = {literal: '}' }
var quote_dbl = {literal: '"' }
var comma = {literal: ',' }

function addToObj(obj, keyval){
  if(obj[keyval.key]) {
    console.log("WARNING: field "+keyval.key+ " was already defined on object "+obj._id+". Ignoring this value.");
    return;
  }else{
    obj[keyval.key]=keyval.value;
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

%}

# A bibfile is a sequence of entries, with comments interspersed
# Note that % is "is not a comment character in the database files" (ftp://ftp.ctan.org/tex-archive/biblio/bibtex/contrib/doc/btxdoc.pdf)
#
main  -> outside_entry (entry outside_entry):*  {%
                                                   function (data, location, reject) {
                                                     var objs=[];
                                                     if(data[0].length > 0) objs.push(data[0]);
                                                     for(var i in data[1]){
                                                      objs.push(data[1][i][0]);
                                                      if(data[1][i][1].length > 0) objs.push(data[1][i][1]);
                                                     }
                                                     return objs;
                                                   }
                                                 %}

#
# TODO add support for common LaTeX operations
#
outside_entry -> non_entry:*
                 {% function (data, location, reject) {
                        var tokenz = [];
                        for(var i=0;i<data[0].length;i++){
                          if(typeof data[0][i] == 'string' || typeof data[0][i] == 'number' ) tokenz.push(data[0][i]);
                          else if(data[0][i].string) tokenz.push(data[0][i].string);
                          else if(data[0][i].length == 1) tokenz.push(data[0][i][0]);
                          else throw new Error("Can't handle token "+JSON.stringify(data[0][i]));
                        }
                        return joinTokens(tokenz);
                    }
                 %}

_                  -> %ws:?

entry              -> (entry_bib | entry_comment | entry_preamble | entry_string) {%  function (data, location, reject) {return data[0][0];} %}

entry_bib          -> %entry_type_bib _ %brace_l _ refkey _ %comma _ (keyval _ %comma _):* keyval (_ %comma):? _ %brace_r
                      {% function (data, location, reject) {
                             var obj = {
                              _id: data[4]
                             };
                             var keyvals = data[8];
                             for(var kv=0;kv<keyvals.length;kv++){
                               addToObj(obj, keyvals[kv][0]);
                             }
                             addToObj(obj, data[8]);
                             return obj;
                         } %}
entry_string       -> %entry_type_string _ %brace_l _ keyval _ %brace_r
                      {% function (data, location, reject) {
                             return {type: 'string', key: data[4][0], value: data[4][1]};
                         } %}
entry_preamble     -> %entry_type_preamble %brace_l non_closing_bracket:+ %brace_r

#
# See http://ftp.math.purdue.edu/mirrors/ctan.org/info/bibtex/tamethebeast/ttb_en.pdf:
#
#   There is a special entry type named @comment. The main use of such an entry type is to comment a large part
#    of the bibliography easily, since anything outside an entry is already a comment, and commenting out one
#    entry may be achieved by just removing its initial @
#
# ^ this suggests that opening braces within the comment MUST be closed, and the comment ends on the first ending brace
#   that balances with this opening brace
#
entry_comment      -> %entry_type_comment %brace_l braced_comment %brace_r {% function (data, location, reject) {
                                                                                return {type: 'comment', data: data[2]};
                                                                              }
                                                                           %}
braced_comment     -> %brace_l (non_bracket|braced_comment):* %brace_r {% function (data, location, reject) {
                                                                           return "{"+joinTokens(data[1])+"}";
                                                                         }
                                                                       %}

keyval             -> key_string _ %eq _ value_string
                      {% function (data, location, reject) {return [data[0], data[4]];}%}

#
# Case-independent sequence of non-whitespace, non-brace, non-commas
#
key_string         -> stringreftoken:+ {% function (data, location, reject) { return joinTokens(data[0]).toLowerCase(); } %}

#
# • Values (i.e. right hand sides of each assignment) can be either between curly braces or between
#   double quotes. The main difference is that you can write double quotes in the first case, and not
#   in the second case.
# • For numerical values, curly braces and double quotes can be omitted.
#
value_string       ->  (quoted_string_or_ref (%pound quoted_string_or_ref):* | braced_string | %num)
                      {% function (data, location, reject) {
                        //console.log("DATA",JSON.stringify(data));
                             var match = data[0];
                             if(match.length == 2){
                              // quoted string
                              var tokenz = [];
                              tokenz.push(match[0]);
                              for(var i=0;i<match[1].length;i++) tokenz.push(match[1][i]);
                              return tokenz;
                             } else return match;
                         }
                      %}

braced_string         -> %brace_l %brace_r
                         {% function (data, location, reject) { return joinTokens(data[1]); } %}
quoted_string_or_ref -> (quoted_string | string_ref) {% function (data, location, reject) {
                                                          //console.log(data);
                                                          if (data[0][0].type=='quotedstring') return data[0][0].data;
                                                          else{return data[0][0];}
                                                        }
                                                     %}

quoted_string        -> %quote_dbl (escaped_quote|non_quote_dbl):* %quote_dbl
                        {% function (data, location, reject) {
                             var tks = [];
                             for(var i in data[1]) tks.push(data[1][i][0]);
                             return {type:'quotedstring', data: joinTokens(tks)};
                           }
                        %}
escaped_quote      -> %brace_l %quote_dbl %brace_r {% function (data, location, reject) { return '"'; } %}

string_ref         -> (stringreftoken_n_num stringreftoken:*)
                      {% function (data, location, reject) { var str = data[0][0]+joinTokens(data[0][1]); return {stringref: str}; } %}

# Text that is enclosed in braces is marked not to be touched by any formating instructions. For instance, when a style defines the title to become depicted using only lowercase, italic letters, the enclosed part will be left untouched. "An Introduction To {BibTeX}" would become ,,an introduction to the BibTeX'' when such a style is applied. Nested braces are ignored.
braced_text         ->  %brace_l braced_text_content %brace_r
                        {% function (data, location, reject) { return joinTokens(data[1]); } %}
braced_text_content ->  %brace_l braced_text_content %brace_l | non_bracket:*
                        {% function (data, location, reject) {
                             if(data.length >= 3) return data[1];
                             var tks=[];
                             for(var t=0;t<data[0].length;t++)
                               if(data[0][t]!='{' && data[0][t]!='}') tks.push(data[0][t]);
                             return joinTokens(tks);
                           }
                        %}



refkey              -> (%tok_id |       %num |          %brace_l | %brace_r     %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment | %pound) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
non_quote_dbl       -> (%tok_id | %ws | %num | %comma | %brace_l | %quote_dbl | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment | %pound | %eq) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
non_closing_bracket -> (%tok_id | %ws | %num | %comma | %brace_l | %brace_r   | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment | %pound | %eq) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
non_bracket         -> (%tok_id | %ws | %num | %comma |            %brace_r   | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment | %pound | %eq) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
# Non-white non-brace, non-comma
stringreftoken      -> (%tok_id | %num | %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
stringreftoken_n_num ->(%tok_id |        %entry_type_bib | %entry_type_string | %entry_type_preamble | %entry_type_comment) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
non_entry           -> (%tok_id | %ws | %num | %comma | %eq | %brace_l | %brace_r | %pound) {% function (data, location, reject) { if(typeof data[0][0]=='object') {if(!data[0][0].string)throw new Error("Expected "+data[0]+"to have a 'string' field");return data[0][0].string;} else {if((!(typeof data[0][0] == 'string'||typeof data[0][0]=='number')))throw new Error("Expected "+data[0][0]+" to be a string");return data[0][0]; }} %}
