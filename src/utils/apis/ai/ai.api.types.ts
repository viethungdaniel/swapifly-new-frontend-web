import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchAiStylesPayload = Payload;
export type FetchAiStylesResponseData = {
  pagination: {
    total: number;
  };
  data: {
    id: string;
    name: string;
  }[];
};

export type FetchAiStyleDescriptionPayload = {
  params: {
    title: string;
    ord: number;
    ai_style: string;
    brand?: string;
  };
} & Payload;
export type FetchAiStyleDescriptionResponseData = string;
