import {convertLaTeX} from "latex-to-unicode-converter";
import {
  isFixArg,
  isOptArg,
  isSubOrSuperScript,
  isTeXBraces,
  isTeXChar,
  isTeXComm,
  isTeXComment,
  isTeXEnv,
  isTeXLineBreak,
  isTeXMath,
  isTeXRaw,
  LaTeX,
  TeXArg
} from "latex-parser";


const isNumber = (str: any): str is number => typeof str === "number";

export function convertLaTeXToUnicode(str: string | number) {
  if(isNumber(str)) return str.toString();
  else return convertLaTeX({
      translateTo: "unicode",
      onError: (e: Error, l) => stringifyLaTeX(l)
    }, str);
}

// TODO just return the input string...?
function stringifyLaTeX(tex: LaTeX | TeXArg): string {
  const arr: string[] = [];
  (stringifyLaTeXInner(tex, arr));
  return arr.join("");
}

function stringifyLaTeXInner(tex: LaTeX | TeXArg, soFar: string[]): void {
  if (isTeXComm(tex)) {
    soFar.push("\\", tex.name);
    tex.arguments.forEach(l => stringifyLaTeXInner(l, soFar));
  }
  else if (isTeXEnv(tex))
    throw new Error("not supported yet");
  else if (isTeXMath(tex)) {
    soFar.push(tex.startSymbol);
    tex.latex.forEach(t => stringifyLaTeXInner(t, soFar));
    soFar.push(tex.endSymbol);
  }
  else if (isTeXLineBreak(tex))
    soFar.push("\n");
  else if (isSubOrSuperScript(tex)) {
    soFar.push(tex.symbol);
    if (tex.arguments)
      tex.arguments.forEach(arg => (stringifyLaTeXInner(arg, soFar)));
  } else if (isTeXBraces(tex)) {
    soFar.push("{");
    tex.latex.forEach(t => stringifyLaTeXInner(t, soFar));
    soFar.push("}");
  } else if (isTeXComment(tex)) {
    soFar.push("%" + tex.text + "\n");
  } else if (isTeXRaw(tex))
    soFar.push(tex.text);
  else if (isTeXChar(tex))
    throw new Error("not supported yet");
  else if (isFixArg(tex)) {
    soFar.push("{");
    tex.latex.forEach(t => stringifyLaTeXInner(t, soFar));
    soFar.push("}");
  }
  else if (isOptArg(tex)) {
    soFar.push("[");
    tex.latex.forEach(t => stringifyLaTeXInner(t, soFar));
    soFar.push("]");
  } else throw new Error("Did not recognize " + JSON.stringify(tex));
}
