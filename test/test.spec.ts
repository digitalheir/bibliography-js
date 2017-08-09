import "mocha";

import {expect} from "chai";
import {parsePageRange} from "../src/bibliography/fields/PageRange";

// TODO test crossref?


describe("PageRange", () => {
  it("should parse 1-10", function () {
    expect(parsePageRange("1-10")).to.deep.equal(["1", "10"]);
  });
  it("should parse 11", function () {
    expect(parsePageRange("11")).to.deep.equal("11");
  });
});
