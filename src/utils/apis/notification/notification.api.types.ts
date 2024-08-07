import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchNotificationsPayload = {
  params?: {
    page?: number;
    limit?: number;
  };
} & Payload;
export type FetchNotificationsResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
  data: {
    id: number;
    create_time: number;
    msg: string; // title
    short_desc: string;
    is_read: BooleanNumber;
    related_type: string;
    related_value: string;
    type: string;
    url: string;
  }[];
};

export type FetchNotificationPayload = {
  params: {
    id: number;
  };
} & Payload;
export type FetchNotificationResponseData = {
  id: number;
  create_time: number;
  msg: string;
  content: string;
  short_desc: string;
  is_read: BooleanNumber;
  image: string;
  related_type: string;
  related_value: string;
  related_value_item: {
    id: number;
    username?: string;
    title?: string;
    category_id?: number;
    max_price?: number;
    min_price?: number;
    product_conditions?: number[];
    sort_id?: number;
    brand_ids?: number[];
    brand_id?: number;
    trade_in_person?: BooleanNumber;
    by_post_and_courier?: BooleanNumber;
    merchant_location_ids?: number[];
    merchant_ids?: number;
  };
  type: string;
  url: string;
};

export type ReadNotificationPayload = {
  params: {
    id: number;
  };
} & Payload;

export type ReadAllNotificationPayload = Payload;

export type FetchUnreadNotificationCountPayload = Payload;
