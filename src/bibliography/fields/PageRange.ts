export type PageRange = string | [string, string]

export function parsePageRange(str: string): PageRange {
  const pages = str
    // Replace any dash sequence with double dashes
    .replace(
      /[\u002d\u007e\u058a\u05be\u1400\u1806\u2010\u2011\u2012\u2013\u2014\u2015\u2053\u207b\u208b\u2212\u2e17\u2e3a\u2e3b\u301c\u3030\u30a0\ufe58\ufe63\uff0d]+/g,
      "--"
    )
    // Split on double dashes
    .split("--")
    .filter(s => !!s);
  if (pages.length === 1)
    return pages[0];
  if (pages.length === 2)
    return pages as [string, string];

  throw new Error("Could not parse page range: " + str);
}
