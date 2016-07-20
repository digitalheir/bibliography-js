const simpleModifier = function (modifier) {
  return (char) => {
    return char + modifier;
  }
};
const barredLetter = function (char) {
  switch (char) {
    case 'l':
      return "ł";
    case 'L':
      return "Ł";
    default:
      throw new Error("I do not know how to modify the following string: " + char + ". " +
        "Change your BiBTeX file or submit a feature request.");
  }
};
const graveAccent = function (char) {
  switch (char) {
    case 'e':
      return 'è';
    case 'u':
      return 'ù';
    case 'i':
      return 'ì';
    case 'o':
      return 'ò';
    case 'a':
      return 'à';
    case 'E':
      return 'È';
    case 'U':
      return 'Ù';
    case 'I':
      return 'Ì';
    case 'O':
      return 'Ò';
    case 'A':
      return 'À';
    default:
      return char + "\u0300"
  }
};
function acuteAccent(char) {
  switch (char) {
    case 'e':
      return 'é';
    case 'y':
      return 'ý';
    case 'u':
      return 'ú';
    case 'i':
      return 'í';
    case 'o':
      return 'ó';
    case 'a':
      return 'á';

    case 'E':
      return 'É';
    case 'Y':
      return 'Ý';
    case 'U':
      return 'Ú';
    case 'I':
      return 'Í';
    case 'O':
      return 'Ó';
    case 'A':
      return 'Á';
    default:
      return char + "\u0301"
  }
}
function circumflex(char) {
  switch (char) {
    case 'e':
      return 'ê';
    case 'u':
      return 'û';
    case 'i':
      return 'î';
    case 'o':
      return 'ô';
    case 'a':
      return 'â';

    case 'E':
      return 'Ê';
    case 'U':
      return 'Û';
    case 'I':
      return 'Î';
    case 'O':
      return 'Ô';
    case 'A':
      return 'Â';
    default:
      return char + "\u0302"
  }
}
function dieresis(char) {
  switch (char) {
    case 'e':
      return 'ë';
    case 'y':
      return 'ÿ';
    case 'u':
      return 'ü';
    case 'i':
      return 'ï';
    case 'o':
      return 'ö';
    case 'a':
      return 'ä';

    case 'E':
      return 'Ë';
    case 'Y':
      return 'Ÿ';
    case 'U':
      return 'Ü';
    case 'I':
      return 'Ï';
    case 'O':
      return 'Ö';
    case 'A':
      return 'Ä';
    default:
      return char + "\u0308"
  }
}
function tilde(char) {
  switch (char) {
    case 'o':
      return 'õ';
    case 'a':
      return 'ã';
    case 'n':
      return 'ñ';

    case 'O':
      return 'Õ';
    case 'A':
      return 'Ã';
    case 'N':
      return 'Ñ';
    default:
      return char + "\u0303"
  }
}
function cedilla(char) {
  switch (char) {
    case "c":
      return "ç";
    default:
      return char + "\u0327"
  }
}
function caron(char) {
  switch (char) {
    case "s":
      return "š";
    default:
      return char + "\u030C"
  }
}
function ringOverLetter(char) {
  switch (char) {
    case 'a':
      return "å";
    case 'A':
      return "Å";
    case 'y':
      return "ẙ";
    default:
      return char + "\u030A";
  }
}
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
