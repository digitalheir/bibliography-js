import "mocha";
import {expect} from "chai";

import {isPageRange, isSinglePage, parsePageRange} from "../src/bibliography/fields/PageRange";
import {fromBibtex} from "../src/bibliography/Bibliography";
import {toHtmlAma} from "../src/reference/MLA/html/html";

// TODO test crossref?

const exampleBibliography = `
          @InProceedings{sci69,
            author    = {Marteen Fredrik Adriaan ding de la Trumppert and مهدي N\\"allen and henQuq, jr, Mathize},
            title     = {A Definite Proof That {P} \\gtreqqless {NP} Using Super-{T}uring Computation Near Big Black Holes},
            booktitle = {Proceedings of TextGraphs-6: Graph-based Methods for Natural Language Processing},
            month     = {June},
            year      = {2011},
            address   = {Portland, Oregon},
            publisher = {Association for Computational Linguistics},
            url       = {http://www.aclweb.org/anthology/W11-1107},
            pages = {42--50}
          }
    `;
describe("MLA", () => {
  it("should correctly render MLA", function () {
    const bibliography = fromBibtex(exampleBibliography);
    const mut2011 = bibliography["mut2011"];
    expect(mut2011).to.be.not.null;
    // expect(toHtmlAma(mut2011)).to.eq("");
  });
});

describe("Bibliography", () => {
  it("should parse bibfile", function () {
    const bibliography = fromBibtex(exampleBibliography);
    const mut2011 = bibliography["mut2011"];
    expect(mut2011).to.be.not.null;
    expect(mut2011.authors.length).to.eq(3);
  });
});
describe("PageRange", () => {
  it("should parse 1-10", function () {
    const range = parsePageRange("1-10");
    expect(range).to.deep.equal(["1", "10"]);
    expect(isPageRange(range)).to.deep.equal(true);
    expect(isSinglePage(range)).to.deep.equal(false);
  });
  it("should parse 11", function () {
    const range = parsePageRange("11");
    expect(range).to.deep.equal("11");
    expect(isPageRange(range)).to.deep.equal(false);
    expect(isSinglePage(range)).to.deep.equal(true);
  });
});
