import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchReviewsPayload = {
  params: {
    user_id: number;
    page?: number;
    limit?: number;
    type?: EmptySafeNumber;
    sort_type?: number;
  };
} & Payload;
export type FetchReviewsResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
  data: {
    id: number;
    avatar: string;
    nickname: string;
    create_time: string;
    type: number;
    content: string;
    price: number;
    num: number; // star point
    image: string;
    title: string;
  }[];
};
