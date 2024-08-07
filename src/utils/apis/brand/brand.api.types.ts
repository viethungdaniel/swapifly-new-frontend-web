import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchBrandsPayload = {
  params?: {
    show?: ShowBooleanNumber;
    order_by?: string;
    page?: number;
    limit?: number;
    ids?: number[];
  };
} & Payload;
export type FetchBrandsResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
  data: {
    id: number;
    title: string;
    img: string;
    show: ShowBooleanNumber;
    sort: number;
  }[];
};
