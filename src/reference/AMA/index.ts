import {Author} from "../../bibliography/fields/Author";
import {toHtml} from "./html";



export const AMA = {
  toHtml: toHtml,
  toMarkdown: (ama) => "string",
  toPlainText: (ama) => "string",
  fromPlainText: (string) => ({})
};
