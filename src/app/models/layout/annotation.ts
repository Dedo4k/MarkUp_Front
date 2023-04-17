export interface Annotation {
  folder: string;
  filename: string;
  path: string;
  source: Source;
  size: Size;
  segmented: number;
  object: Object | Object[];
  checked: string;
}

export interface Layout {
  folder: string;
  filename: string;
  path: string;
  source: Source;
  size: Size;
  segmented: number;
  object: Object[];
  checked: string;
}

export interface Object {
  name: string;
  pose: string;
  truncated: number;
  difficult: number;
  bndbox: Bndbox;
}

export interface Bndbox {
  xmin: number;
  ymin: number;
  xmax: number;
  ymax: number;
}

export interface Source {
  database: string;
}

export interface Size {
  width: number;
  height: number;
  depth: number;
}
