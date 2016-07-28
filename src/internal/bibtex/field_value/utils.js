function flattenToString(authorToken) {
  if (typeof authorToken === 'string') return authorToken;
  else if (authorToken.type == 'braced')  return flattenToString(authorToken.data);
  else if (authorToken.type == 'ws') {
    //console.log(authorToken)
    return authorToken.string;
  }
  else if (authorToken.unicode)  return authorToken.unicode;
  else if (authorToken.constructor == Array) return authorToken.map(flattenToString).join('');
  else throw new Error("Could not flatten to string: " + JSON.stringify(authorToken));
}
function capitalizeFirstLetter(string) {
  //console.log(string);
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const getFirstLetter = function (wordObj) {
  if (typeof wordObj === 'string') {
    if (wordObj.length > 1 && wordObj.charAt(0) == '/') return wordObj.charAt(1);
    else if (wordObj.length > 0) return wordObj.charAt(0);
    else return null;
  } else if (wordObj.type == 'braced')  return getFirstLetter(wordObj.data);
  else if (wordObj.unicode)  return getFirstLetter(wordObj.unicode);
  else if (wordObj.constructor == Array) return getFirstLetter(flattenToString(wordObj).trim());
  else throw new Error("Could not determine first letter of " + JSON.stringify(wordObj));
};

const startsWithLowerCase = function (wordObj) {
  return isDigitOrLowerCase(getFirstLetter(wordObj));
};

const isDigitOrLowerCase = function (ch) {
  return ch.match(/[0-9]/) || ch.toUpperCase() != ch;
};


export {isDigitOrLowerCase,flattenToString, getFirstLetter, startsWithLowerCase,capitalizeFirstLetter};
