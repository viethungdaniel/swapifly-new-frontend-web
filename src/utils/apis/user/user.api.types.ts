import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchUsersPayload = {
  params?: {
    page?: number;
    limit?: number;
    query?: string;
  };
} & Payload;
export type FetchUsersResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
  data: {
    id: number;
    realname: string;
    nickname: string;
    username: string;
    region: number;
    email: string;
    avatar: string;
    isfollow: boolean;
    follower_count: number;
  }[];
};

export type FollowUserPayload = {
  params: {
    user_id: number;
    state: number;
  };
} & Payload;

export type FetchUserPayload = {
  params: {
    id: number | string;
  };
} & Payload;
export type FetchUserResponseData = {
  p_type: number;
  shop: {
    id: number;
    avatar: string;
    e_num: number; // user reviews count
    banner: string;
    banner_mobile: string;
    realname: string; // slug
    nickname: string; // Full name
    username: string;
    email: string; // email not empty => verified
    followers: number; // follower count
    following: number; // follower count
    isfollow?: BooleanNumber; // Auth
    reviews: number; // review count
    stars: number; // star point count
    point_average: number; // star point avg
    phone: number;
    shop: number; //  = 1 => merchant
    describe: string;
    merchant_location: {
      id: number;
      title: string;
      label_name: string;
      region_id: number;
    } | null;
  };
};

export type ReportUserPayload = {
  params: {
    user_id: number;
    contact: string;
    why: string;
  };
} & Payload;

export type CheckUniqueUsernamePayload = {
  params: {
    username: string;
  };
} & Payload;

export type FetchInboxThreadOfferProductAiChatUsersPayload = {
  params: {
    product_id: number;
    type: string;
    page?: number;
    limit?: number;
  };
} & Payload;
export type FetchInboxThreadOfferProductAiChatUsersResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
  data: {
    id: number;
    nickname: string;
    username: string;
    email: string;
    avatar: string;
  }[];
};
