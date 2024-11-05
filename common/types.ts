import { PageContextServer } from "vike/types";

export type ServerPageProps = PageContextServer & {
  pageData: {},
};

export type Hero = {
  name: string,
  nid: string,
  cardNid: string,
  kind: string,
};
  
export type CreateChapterRequestInput = {
  hero: number,
  chapter: string,
};

export type UploadToCaptureRequestInput = {
  key: string,
  token: string,
};

export type UploadToCaptureInputParams = {
  chapter: string,
  hero: Hero,
  pages: string,
  binaryImage: ArrayBuffer,
  key: number,
};

export type UploadToCaptureResult = {
  id?: string,
  error?: boolean,
  message?: string,
};
