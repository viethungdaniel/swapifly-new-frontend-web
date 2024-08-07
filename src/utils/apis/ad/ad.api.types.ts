import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchAdsPayload = {
  params: {
    platform?: string;
    types: string[];
  };
} & Payload;
export type FetchAdsResponseData = {
  id: number;
  type: string;
  media_type: string;
  enable_google_ad: BooleanNumber;
  title: string;
  photo: string;
  video: string;
  description: string;
  link: string;
  ref_tilte: string;
  ep_inbox: number;
  ep_rectangle: number;
  ep_square: number;
  ad_publisher: {
    id: number;
    title: string;
    avatar: string;
  } | null;
}[];

export type SubmitAdsClickEventPayload = {
  params: {
    type: string;
    ad_id: number;
    platform: string;
    user_agent: string;
    os: string;
    mobile_model: string;
    app_version: string;
    cookie_id: string;
    region: string;
    timezone: string;
  };
} & Payload;
