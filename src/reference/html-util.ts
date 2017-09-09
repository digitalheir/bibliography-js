export const htmlPropsAuthor = {
  itemprop: "author",
  itemscope: "",
  itemtype: "https://schema.org/Person"
};

export function span(className: string, props: { [k: string]: string }, ...children: string[]) {
  props["class"] = className;
  return el("span", props, children);
}

export function el(name: string, props: { [k: string]: string }, children: string[]) {
  const attrs = Object.keys(props);
  const attrsAsString = attrs.length > 0 ? (` ${attrs.map(f => `${f}='${props[f]}'`).join(" ")}`) : "";
  return `<${name}${attrsAsString}>${children.join("")}</${name}>`
}
