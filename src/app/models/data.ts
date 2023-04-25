import {Annotation, Layout} from "./layout/annotation";

export interface DataDto {
  datasetName: string;
  dataName: string;
  imageName: string;
  imageBytes: Uint8Array[];
  layoutType: string;
  layoutName: string;
  layout: string;
}

export interface Data {
  datasetName: string;
  dataName: string;
  imageName: string;
  imageBytes: Uint8Array[];
  layoutType: string;
  layoutName: string;
  layout: Layout;
}
