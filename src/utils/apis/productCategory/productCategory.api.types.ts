import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchProductCategoriesPayload = {
  params?: {
    show?: ShowBooleanNumber;
    order_by?: string;
    limit?: number;
    by_language?: BooleanNumber;
  };
} & Payload;
export type FetchProductCategoriesResponseData = {
  pagination: {
    total: number;
    total_page: number;
    current_page: number;
    per_page: number;
  };
  data: {
    id: number;
    title: string;
    pid: number; // parent id,
    background: string; // image
    sort: number;
  }[];
};

export type FetchProductCategoryPayload = {
  params: {
    id: number;
  };
} & Payload;
export type FetchProductCategoryResponseData = {
  id: number;
  title: string;
  pid: number;
  background: string;
};
