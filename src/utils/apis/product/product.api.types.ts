import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type ProductsQuery = {
  uid?: number;
  brand_id?: number;
  brand_ids?: number[];
  rid?: number;
  page?: EmptySafeNumber;
  limit?: EmptySafeNumber;
  min?: EmptySafeNumber;
  max?: EmptySafeNumber;
  sort?: EmptySafeNumber;
  lat?: EmptySafeNumber;
  lng?: EmptySafeNumber;
  query?: string;
  offline?: BooleanNumber;
  mail?: BooleanNumber;
  nid?: number | number[];
  nids?: number | number[];
  uids?: number[];
  order_by?: string;
  all_state?: BooleanNumber;
  type?: "all" | "count" | "data"; // default data
  all_region?: BooleanNumber;
  merchant_location_ids?: number[];
};

export type FetchProductsPayload = {
  params?: ProductsQuery;
} & Payload;
export type FetchProductsResponseData = {
  pagination: {
    per_page: number;
    current_page: number;
    total: number;
  };
  data: {
    id: number;
    title: string;
    image: string;
    video_thumbnails: string[];
    videos: string[];
    youtube_link: string;
    price: string;
    currency: string;
    nickname: string;
    avatar: string;
    condition: string;
    islike: BooleanNumber;
    bookmark: boolean;
    state: number;
    purchase_enable: BooleanNumber;
    hot_pick: BooleanNumber;
  }[];
};

export type FetchProductPayload = {
  params: {
    id: number;
  };
} & Payload;
export type FetchProductResponseData = {
  seller_block_chat_this_user: BooleanNumber;
  p_type: number;
  bookmark: BooleanNumber;
  brand: {
    id: number;
    title: string;
    img: string;
  } | null;
  product: {
    id: number;
    title: string;
    image: string;
    images: string[];
    youtube_link: string;
    describe: string;
    price: string;
    price_origin: EmptySafeNumber;
    currency: string;
    purchase_enable: BooleanNumber;
    chat_auto_reply: BooleanNumber;
    chat_time_type: string;
    chat_time_from: string;
    chat_time_to: string;
    chat_ai_style: string;
    chat_ai_style_item: {
      id: string;
      name: string;
    };
    chat_days: number[] | string[];
    rid: {
      id: number;
      title: string;
      background: string;
    }[];
    videos: string[];
    videos_obj: {
      thumbnail: string;
      video: string;
    }[];
    region_obj: {
      id: number;
      flag: string;
      img_url: string;
      short_name: string;
      title: string;
      currency: string;
    };
    create_time: number;
    create_time_text: string;
    traffic: number;
    state: number;
    islike: BooleanNumber;
    like: number;
    condition: string;
    offline: BooleanNumber;
    offline_address: {
      title: string;
      address: string;
      lat: number;
      lng: number;
    }[];
    mail: BooleanNumber;
    mail_note: string;
    hot_pick: BooleanNumber;
  };
  condition_item: {
    id: number;
    advice: string;
    title: string;
  } | null;
  reviews_count: number;
  seller: {
    id: number;
    avatar: string;
    realname: string;
    nickname: string;
    create_time: string;
    email: string;
    country_code: string;
    phone: string;
    stars: number;
    point_average: number;
    e_num: number; // user review count
    r_state: number; // user responsive
    merchant_location: {
      id: number;
      label_name: string;
      title: string;
      region_id: number;
    } | null;
  };
};

export type AddProductBookmarkPayload = {
  params: {
    id: number;
  };
} & Payload;

export type RemoveProductBookmarkPayload = {
  params: {
    id: number;
  };
} & Payload;

export type LikeProductPayload = {
  params: {
    product_id: number;
    state: number;
  };
} & Payload;

export type ReportProductPayload = {
  params: {
    product_id: number;
    contact: string;
    why: string;
  };
} & Payload;

export type FetchRecommendedProductsPayload = {
  params?: Omit<ProductsQuery, "query" | "sort"> & {
    all_region?: BooleanNumber;
    cookie_token?: string;
  };
} & Payload;
export type FetchRecommendedProductsResponseData = FetchProductsResponseData;

export type FetchSimilarProductsPayload = {
  params: Pick<ProductsQuery, "limit" | "page"> & {
    id: number;
  };
} & Payload;
export type FetchSimilarProductsResponseData = FetchProductsResponseData;

export type FetchBookmarkedProductsPayload = {
  params?: Omit<ProductsQuery, "query" | "sort">;
} & Payload;
export type FetchBookmarkedProductsResponseData = FetchProductsResponseData;

export type DeleteProductPayload = {
  params: {
    id: number;
  };
} & Payload;

export type MarkSoldProductPayload = {
  params: {
    id: number;
  };
} & Payload;

export type FetchDraftProductsPayload = Payload;
export type FetchDraftProductsResponseData = {
  id: number;
  title: string;
  images: string[];
}[];

export type AddDraftProductPayload = {
  params: {
    rid: number;
    brand_id: number;
    title: string;
    region: number;
    price: EmptySafeNumber;
    currency: string;
    images: string[];
    youtube_link: string;
    videos: string[];
    video_thumbnails: string[];
    chat_auto_reply?: BooleanNumber;
    chat_time_type?: string;
    chat_days?: string[];
    chat_time_from?: string;
    chat_time_to?: string;
    chat_ai_style?: string;
    nid: number;
    offline: BooleanNumber;
    offline_address: {
      title: string;
      address: string;
      lat: number;
      lng: number;
    }[];
    mail: number;
    mail_note: string;
    describe: string;
  };
} & Payload;

export type UpdateDraftProductPayload = {
  params: {
    id: number;
    rid: number;
    brand_id: number;
    title: string;
    region: number;
    price: EmptySafeNumber;
    currency: string;
    images: string[];
    youtube_link: string;
    videos: string[];
    video_thumbnails: string[];
    chat_auto_reply?: BooleanNumber;
    chat_time_type?: string;
    chat_days?: string[];
    chat_time_from?: string;
    chat_time_to?: string;
    chat_ai_style?: string;
    nid: number;
    offline: BooleanNumber;
    offline_address: {
      title: string;
      address: string;
      lat: number;
      lng: number;
    }[];
    mail: number;
    mail_note: string;
    describe: string;
  };
} & Payload;

export type DeleteDraftProductPayload = {
  params: {
    id: number;
  };
} & Payload;

export type FetchDraftProductPayload = {
  params: {
    id: number;
  };
} & Payload;
export type FetchDraftProductResponseData = {
  id: number;
  rid: number;
  uid: number;
  brand_id: number;
  title: string;
  price: string;
  currency: string;
  images: string[];
  youtube_link: string;
  chat_auto_reply: BooleanNumber;
  chat_time_type: string;
  chat_days: string[] | number[];
  chat_time_from: string;
  chat_time_to: string;
  chat_ai_style_item: {
    id: string;
    name: string;
  };
  videos_obj: {
    video: string;
    thumbnail: string;
  }[];
  videos: string[];
  video_thumbnails: string[];
  nid: SafeNumber;
  offline: BooleanNumber;
  offline_address: {
    title: string;
    address: string;
    lat: number;
    lng: number;
  }[];
  mail: BooleanNumber;
  mail_note: string;
  condition_item: {
    id: number;
    advice: string;
    title: string;
  } | null;
  region_obj: {
    id: number;
    flag: string;
    img_url: string;
    short_name: string;
    title: string;
    currency: string;
  } | null;
  price_origin: EmptySafeNumber;
  region: number;
  create_time: number;
  lat: SafeNumber;
  lng: SafeNumber;
  describe: string;
  category: {
    id: number;
    background: string;
    show_tradein: BooleanNumber;
    show_bypost: BooleanNumber;
    title: string;
    advice: string;
  };
  brand: null;
};

export type UpdateProductPayload = {
  params: {
    id: number;
    rid: number;
    brand_id: number;
    title: string;
    region: number;
    price: EmptySafeNumber;
    currency: string;
    images: string[];
    youtube_link: string;
    videos: string[];
    video_thumbnails: string[];
    chat_auto_reply?: BooleanNumber;
    chat_time_type?: string;
    chat_days?: string[];
    chat_time_from?: string;
    chat_time_to?: string;
    chat_ai_style?: string;
    nid: number;
    offline: BooleanNumber;
    offline_address: {
      title: string;
      address: string;
      lat: number;
      lng: number;
    }[];
    mail: BooleanNumber;
    mail_note: string;
    describe: string;
  };
} & Payload;

export type AddProductPayload = {
  params: {
    rid: number;
    brand_id: number;
    title: string;
    region: number;
    price: EmptySafeNumber;
    currency: string;
    images: string[];
    youtube_link: string;
    videos: string[];
    video_thumbnails: string[];
    chat_auto_reply?: BooleanNumber;
    chat_time_type?: string;
    chat_days?: string[];
    chat_time_from?: string;
    chat_time_to?: string;
    chat_ai_style?: string;
    nid: number;
    offline: BooleanNumber;
    offline_address: {
      title: string;
      address: string;
      lat: number;
      lng: number;
    }[];
    mail: BooleanNumber;
    mail_note: string;
    describe: string;
  };
} & Payload;
