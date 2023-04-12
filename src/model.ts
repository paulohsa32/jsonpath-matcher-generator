export interface PathRef {
  id: string;
  key: string;
  value: any;
  type: string;
  layer: number;
  parentId?: string;
  fullPath?: string;
}
