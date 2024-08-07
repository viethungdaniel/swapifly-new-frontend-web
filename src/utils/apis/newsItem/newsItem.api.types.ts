import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchNewsItemsPayload = {
  params?: {
    page?: number;
    limit?: number;
    query?: string;
    ignored_news_id?: number;
  };
} & Payload;
export type FetchNewsItemsResponseData = {
  data: {
    id: number;
    news_time: number;
    title: string;
    abstract: string;
    img: string;
  }[];
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
};

export type FetchNewsItemPayload = {
  params: {
    id: number;
  };
} & Payload;
export type FetchNewsItemResponseData = {
  news: {
    id: number;
    news_time: number;
    title: string;
    abstract: string;
    img: string;
    details: string;
  };
  addition_news: {
    next: {
      id: number;
      news_time: number;
      title: string;
    } | null;
    previous: {
      id: number;
      news_time: number;
      title: string;
    } | null;
    recent_news: {
      id: number;
      img: string;
      news_time: number;
      title: string;
    }[];
  };
};
