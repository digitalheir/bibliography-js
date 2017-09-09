export function isEtAl(author): author is "et al" {
  return author === "et al";
}

export function push(strs: string[], str?: string) {
  if (str) strs.push(str);
}

export const htmlPropsDatePublished = {
  prop: "datePublished"
};

export const htmlPropsPublicationLocation = {
  prop: "locationCreated"
};
export const htmlPropsPublisher = {
  // prop: "publisher" // todo
};
