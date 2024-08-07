import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchProductReportPayload = {
  params: {
    product_id: number;
  };
} & Payload;
export type FetchProductReportResponseData = {
  product: {
    id: number;
    image: string;
    title: string;
    price: SafeNumber;
    create_time: number;
    impression_num: number;
    click_num: number;
    inbox_num: number;
    ai_rating_has_data: BooleanNumber;
    ai_rating_description: number;
    ai_rating_photo: number;
    ai_rating_price: number;
    ai_rating_requirement: number;
    ai_rating_review: number;
    ai_rating_traffic: number;
    ai_rating_overal: {
      description: number;
      photo: number;
      price: number;
      requirement: number;
      review: number;
      traffic: number;
    };
  };
  impression: {
    paid: {
      date: string;
      total: number;
    }[];
    natural: {
      date: string;
      total: number;
    }[];
  };
  inbox: {
    date: string;
    total: number;
  }[];
  click: {
    date: string;
    total: number;
  }[];
};
