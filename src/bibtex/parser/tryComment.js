var grammar = require('./comment');
var nearley = require("nearley");

// Create a Parser object from our grammar.
var p = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);

// Parse something
//p.feed([1 + 1, '\\', {type: '@string', string: 'aa'}]);
//p.feed([1 + 1, '\\', '\\', '\\', '\\', {type: '@string', string: 'aa'}]);
//p.feed([1 + 1, '\\', '\\', '\\', '\\', {type: '@string', string: 'aa'},'(',  {type: '@string', string: 'key'}, '=', {type: '@string', string: 'value'}, ')','\\',1,2,3]);
//p.feed([1 + 1, '\\', '\\', '\\', '\\', {type: '@string', string: 'aa'},'(',  {type: '@string', string: 'key'}, '=', '{', '"',123, '}', ')','\\',6,6,6]);
//p.feed([1 + 1, '\\', '\\', '\\', '\\', {type: '@bib', string: 'b00k'}, '(',  {type: 'id', string: 'refkey'},',',
p.feed([1 + 1, '\\', '\\', '\\', '\\', {type: '@bib', string: 'b00k'}, {"type": "ws", "string": "  "},
  '(', {type: 'id', string: 'refkey'}, {"type": "ws", "string": "  "}, ',', {"type": "ws", "string": "  "},
  {type: 'id', string: 'key1'}, '=', 321, '#', '"', '\\', '"', 123, '"', '#', {type: 'id', string: 'memeref'}, ',',
  {"type": "id", "string": "auTHor"}, {"type": "ws", "string": "    "},
  '=',
  {"type": "ws", "string": "\t"}, {type: 'id', string: 'memeref'}, '#', '"', '{', '}', '"', ',',
  {type: 'id', string: 'key2'}, '=', '{', '{', '\\', '"', {type: 'id', string: 'o'}, '}', 123, '}', ',',
  //{type: 'id', string: 'Title'}, '=', '"', '#' '"', ',',
  ')', '\\', 6, 6, 6]);

console.log(p.results.length);
console.log(p.results[0]);

for (var r in p.results) {
  var fields = p.results[r][1].fields;
  for (var fieldname in fields) {
    if (fields.hasOwnProperty(fieldname)) {
      console.log(fieldname, JSON.stringify(fields[fieldname]));
    }
  }
}

// [ ["sum", "1", "1"] ]
