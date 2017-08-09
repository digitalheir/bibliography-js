const simpleModifier = function (modifier) {
  return (char) => {
    return char + modifier;
  }
};

function modifyStringFunction(conversionTable, _default_append) {
  return (string) => {
    if (conversionTable.hasOwnProperty(string)) return conversionTable[string];

    if (!_default_append) throw new Error("I do not know how to modify the following string: " + string + ". "
      + "Change your BiBTeX file or submit a feature request at https://github.com/digitalheir/bibliography-js/issues.");
    return string + _default_append;
  }
}

const barredLetter = modifyStringFunction({
  l: "ł",
  L: "Ł"
});

const graveAccent = modifyStringFunction({
  e: 'è',
  u: 'ù',
  i: 'ì',
  o: 'ò',
  a: 'à',
  E: 'È',
  U: 'Ù',
  I: 'Ì',
  O: 'Ò',
  A: 'À'
}, "\u0300");

const acuteAccent = modifyStringFunction({
  e: 'é',
  y: 'ý',
  u: 'ú',
  i: 'í',
  o: 'ó',
  a: 'á',

  E: 'É',
  Y: 'Ý',
  U: 'Ú',
  I: 'Í',
  O: 'Ó',
  A: 'Á'
}, "\u0301");
const circumflex = modifyStringFunction({
  e: 'ê',
  u: 'û',
  i: 'î',
  o: 'ô',
  a: 'â',

  E: 'Ê',
  U: 'Û',
  I: 'Î',
  O: 'Ô',
  A: 'Â'
}, "\u0302");

const dieresis = modifyStringFunction({
  e: 'ë',
  y: 'ÿ',
  u: 'ü',
  i: 'ï',
  o: 'ö',
  a: 'ä',

  E: 'Ë',
  Y: 'Ÿ',
  U: 'Ü',
  I: 'Ï',
  O: 'Ö',
  A: 'Ä'
}, "\u0308");

const tilde = modifyStringFunction({
  o: 'õ',
  a: 'ã',
  n: 'ñ',

  O: 'Õ',
  A: 'Ã',
  N: 'Ñ'
}, "\u0303");

const cedilla = modifyStringFunction({
  c: "ç"
}, "\u0327");

const caron = modifyStringFunction({
  s: "š"
}, "\u030C");

const ringOverLetter = modifyStringFunction({
  a: "å",
  A: "Å",
  y: "ẙ"
}, "\u030A");

function tieLetters(chars) {
  //o͡o
  return chars.charAt(0) + '͡' + chars.substring(1);
}
function circledA(char) {
  if (char == 'a') {
    return 'å';
  } else throw new Error("I do not know how to modify the following string: " + char + ". " +
    "Change your BiBTeX file or submit a feature request.");
}

function slashed(char) {
  if (char == 'o') {
    return 'ø';
  } else throw new Error("I do not know how to modify the following string: " + char + ". " +
    "Change your BiBTeX file or submit a feature request.");
}
const diacritics = {
  '`': graveAccent, //{o}	ò	grave accent
  "'": acuteAccent, // Acute accent
  '^': circumflex, //{o}	ô	circumflex
  '~': tilde, //{o}	õ	tilde
  '=': simpleModifier("\u0304"), //{o}	ō	macron accent (a bar over the letter)
  '.': simpleModifier("\u0307"), //{o}	ȯ	dot over the letter
  '"': dieresis, //{o}	ö	umlaut, trema or dieresis
  'H': simpleModifier("\u030B"), //{o}	ő	long Hungarian umlaut (double acute)
  'c': cedilla, //{c}	ç	cedilla
  'k': simpleModifier("\u0328"), //{a}	ą	ogonek
  'l': barredLetter, //{}	ł	barred l (l with stroke)
  'b': simpleModifier("\u0331"), //{o}	o	bar under the letter
  'd': simpleModifier("\u0323"), //{u}	ụ	dot under the letter
  'r': ringOverLetter, //{a}	å	ring over the letter (for å there is also the special command \aa)
  'u': simpleModifier("\u0306"), //{o}	ŏ	breve over the letter
  'v': caron, //{s}	š	caron/háček ("v") over the letter
  't': tieLetters, //{oo}	o͡o	"tie" (inverted u) over the two letters
  'a': circledA,
  'o': slashed //	ø	slashed o (o with stroke)
};
const specialChars = {
  'i': 'ı',
  'j': 'ȷ',
  'oe': 'œ',
  'OE': 'Œ',
  'ae': 'æ',
  'AE': 'Æ',
  'aa': 'å',
  'AA': 'Å',
  'o': 'ø',
  'O': 'Ø',
  'ss': 'ß',
  'l': 'ł',
  'L': 'Ł'
};
export {diacritics, specialChars};
