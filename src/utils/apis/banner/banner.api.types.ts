import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchBannersPayload = {
  params?: {
    show?: BooleanNumber;
    order_by?: string;
  };
} & Payload;
export type FetchBannersResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
  };
  data: {
    id: number;
    img: string; // desktop image
    img_m: string; // mobile image
    link: string;
    title: string;
    sort: number;
  }[];
};
