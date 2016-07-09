class Token {
  constructor(type, string) {
    this.type = type;
    this.string = string;
  }
}

const ID = "id";
const whitespace = "ws";
const NUMBER = 'number';

export default class Lexer {
  constructor(string) {
    this.str = string;
    this.len = string.length;
    this.pos = 0;
  }

  getStringUntilNonEscapedChar(terminalRegex) {
    if (typeof terminalRegex == 'string') {
    }
    const chars = [];
    for (let i = this.pos; i < this.len; i++) {
      this.pos = i;
      if (this.str.charAt(i) == '\\' && this.str.charAt(i + 1).match(terminalRegex)) {
        i++;
        this.pos = i;
      } else if (this.str.charAt(i).match(terminalRegex)) {
        break;
      }
      chars.push(this.str.charAt(i));
    }
    return chars.join("");
  }

  readNextToken() {
    if (this.pos >= this.str.length) return null;

    let c = this.str.charAt(this.pos);
    if (Lexer.isWhiteSpace(c)) return this.getWhiteSpace(c);
    else if (Lexer.isSpecialChar(c)) {
      this.pos++;
      if (c == '@') {
        let type = this.getStringUntilNonEscapedChar('{').trim().toLowerCase();
        switch (type) {
          case 'string':
          case 'preamble':
          case 'comment':
            return new Token('@' + type, type); // TODO maybe use symbols to be less memory intensive?
          default:
            return new Token('@bib', type);
        }
      }
      return c;
    } else if (Lexer.isNum(c)) {
      var nums = [c];
      const pos2 = this.pos + 1;
      for (var n = pos2; n < this.len; n++) {
        this.pos = n;
        const charAt = this.str.charAt(n);
        if (Lexer.isNum(charAt)) nums.push(charAt);
        else break;
      }
      const numString = nums.join("");
      if (numString[0] == '0')  // If it starts with 0, return as a string
        return new Token(NUMBER, numString);

      const number = Number.parseInt(numString);
      if (Number.isFinite(number)) return number;
      else return new Token(NUMBER, numString);
    } else {
      // id
      let chars = [];
      const pos2 = this.pos;
      for (var i = pos2; i < this.len + 1; i++) {
        this.pos = i;
        // console.log(this.pos, i);
        // console.log(this.pos, this.str.charAt(i));
        const charAtI = this.str.charAt(i);
        if (!Lexer.isId(charAtI)) break;
        else if (charAtI == '\\' && (this.str.charAt(i + 1) == '\\' || Lexer.isSpecialChar(this.str.charAt(i + 1)))) {
          i++;
          this.pos = i;
          chars.push(this.str.charAt(i));
        } else {
          chars.push(charAtI);
        }
      }

      return new Token(ID, chars.join("").trim());
    }
  }

  static isNum(c) {
    return c == '0' ||
      c == '1' ||
      c == '2' ||
      c == '3' ||
      c == '4' ||
      c == '5' ||
      c == '6' ||
      c == '7' ||
      c == '8' ||
      c == '9';
  }


  static isSpecialChar(c) {
    return (c == '@'
    || c == '{'
    || c == '}'
    || c == '#'
    || c == '='
    || c == ','
    || c == '"');
  }


  isEscapeChar(i) {
    if (this.buf.charAt(i) == '\\') {
      // Might be an escaped character
      const nextChar = this.buf.charAt(i + 1);
      switch (nextChar) {
        case '\\':
        case '@':
        case '{':
        case '}':
          // We've escaped a special character
          return true;
        default:
          return false;
      }
    }
  }


  getWhiteSpace() {
    var chars = [];
    while (this.pos < this.len) {
      var c = this.str.charAt(this.pos);
      // ignore whitespaces
      if (Lexer.isWhiteSpace(c)) {
        chars.push(c);
        this.pos++;
      } else break;
    }
    return new Token(whitespace, chars.join(""));
  }

  static isWhiteSpace(c) {
    switch (c) {
      case ' ':
      case '\t':
      case '\r':
      case '\n':
        return true;
      default:
        return false;
    }
  }

  static isId(c) {
    return !(Lexer.isSpecialChar(c) || Lexer.isNum(c) || Lexer.isWhiteSpace(c))
  }
}
