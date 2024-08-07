import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type FetchHelpCentersPayload = {
  params?: {
    page?: number;
    limit?: number;
    query?: string;
  };
} & Payload;
export type FetchHelpCentersResponseData = {
  data: {
    id: number;
    title: string;
    abstract: string;
  }[];
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
};

export type FetchHelpCenterPayload = {
  params: {
    id: number;
  };
} & Payload;
export type FetchHelpCenterResponseData = {
  help_center: {
    id: number;
    title: string;
    create_time: number;
    abstract: string;
    details: string;
    meta_image: string;
    meta_keywords: string;
    category: {
      id: number;
      title: string;
      parent: {
        id: number;
        title: string;
      };
    };
  };
  same_topic: {
    id: number;
    title: string;
  }[];
};

export type FetchHelpCentersItemPayload = Payload;
export type HelpCentersItem = {
  id: number;
  title: string;
  children?: HelpCentersItem[];
  help_centers?: HelpCentersItem[];
};
export type FetchHelpCentersItemResponseData = {
  topic: HelpCentersItem[];
  faq: HelpCentersItem[];
  announcement: HelpCentersItem[];
};
