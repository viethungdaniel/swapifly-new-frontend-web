import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchInboxThreadsPayload = {
  params: {
    page?: number;
    limit?: number;
    type: number;
  };
} & Payload;
export type FetchInboxThreadsResponseData = {
  id: number;
  avatar: string;
  nickname: string;
  price: number;
  currency: string;
  pid: number;
  p_title: string;
  p_state: number;
  p_image: string;
  p_price: string;
  latest_time: number;
  latest_type: number;
  user_type: string;
  new_text: {
    c_type: number;
    isread: BooleanNumber;
    content: string;
  };
}[];

export type FetchInboxThreadMessagesPayload = {
  params: {
    inbox_thread_id: number;
    page?: number;
    limit?: number;
  };
} & Payload;
export type FetchInboxThreadMessagesResponseData = {
  id: number;
  uid: number;
  type: number; //
  from_type: number; // 1 user normal 2 bot
  block: number;
  create_time: number;
  c_type: number;
  content: string;
  currency: string;
  price: number;
  isread: BooleanNumber;
}[];

export type FetchInboxThreadOfferPayload = {
  params: {
    inbox_thread_id: number;
  };
} & Payload;
export type FetchInboxThreadOfferResponseData = {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price_origin: number;
  product_currency_origin: string;
  product_state: number;
  offer_price_origin: number;
  offer_currency_origin: string;
  offer_status: number;
  seller_id: number;
  seller_is_shop: number;
  seller_avatar: string;
  seller_nickname: string;
  seller_username: string;
  s_online: BooleanNumber;
  seller_last_online_time: number;
  buyer_id: number;
  buyer_avatar: string;
  buyer_nickname: string;
  buyer_username: string;
  buyer_last_online_time: number;
  c_review: BooleanNumber;
  c_block: BooleanNumber;
  c_online: BooleanNumber;
  s_review: BooleanNumber;
  b_review: BooleanNumber;
  b_block: BooleanNumber;
  s_block: BooleanNumber;
  b_archive: BooleanNumber;
  s_archive: BooleanNumber;
  current_chat_auto_reply: BooleanNumber;
  chat_auto_reply_switch_status: string;
  chat_auto_reply_resume_at?: number;
};

export type DeleteInboxThreadsPayload = {
  params: {
    chat_ids: number[];
  };
} & Payload;

export type SaveInboxThreadArchivedStatePayload = {
  params: {
    chat_ids: number[];
    type: number; // 1 archive 2 unarchive
  };
} & Payload;

export type FetchUnreadInboxThreadMessageCountPayload = Payload;

export type UpdateInboxThreadAiChatStatusPayload = {
  params: {
    product_id: number;
    type: string;
    user_ids: number[];
    chat_auto_reply_disable_seconds?: number;
  };
} & Payload;
