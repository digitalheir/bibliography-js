export function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const RE_WHITESPACE = /\s+/g;

export const isString = (x: any): x is string => typeof x === "string";
