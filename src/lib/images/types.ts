export enum PreviewName {
  PREVIEW = "preview",
  TWITTER = "twitter",
}

export type Preview = {
  name: PreviewName;
  image: Buffer;
};
