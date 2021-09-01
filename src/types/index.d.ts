export interface BaseResponse<T> {
  code: number;
  message: string;
  result: T;
  success: boolean;
  timestamp: number;
}
export interface PageQuery {
  pageNo: number;
  pageSize?: number;
}

export interface Page<T> {
  current: number;
  pages: number;
  records: T[];
  searchCount: boolean;
  size: number;
  total: number;
}

export interface Info {
  id: number;
  kind: number;
  type: string;
  typeText: string;
  subtype: string | null;
  subtypeText: string | null;
  url: string | null;
  title: string;
  description: string | null;
  origin: string | null;
  cover: string | null;
  duration: number | null;
  isTop: boolean;
  isValid: boolean;
  createTime: Date;
  updateTime: Date;
}
export interface INews {
  createTime: Date;
  id: number;
  pics: string;
  rowStatus: boolean;
}
export interface IPic {
  id: number;
  isQr: boolean;
  link: string | null;
  location: number;
  remark: string;
  rowStatus: boolean;
  sequence: number | null;
  url: string;
  createTime: Date;
  publishTime?: Date;
}
export interface IFeedback {
  contact: string | null;
  content: string | null;
  createTime: Date;
  id: number;
  rowStatus: boolean;
}

export interface ICollection {
  id: number;
  kind: number;
  name: string;
  cover: string;
  subtitle: string | null;
  description: string | null;
  isValid: boolean;
  createTime: Date;
  updateTime: Date;
}
