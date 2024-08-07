import type { CancelToken, RawAxiosRequestHeaders } from "axios";

type Payload = {
  cancelToken?: CancelToken;
  headers?: RawAxiosRequestHeaders;
};

export type SignInPayload = {
  params: {
    email: string;
    password: string;
  };
} & Payload;

export type SignInWithGooglePayload = {
  params: {
    code: string;
  };
} & Payload;
export type SignInWithGoogleResponseData = {
  token: string;
};

export type SignInWithWeChatPayload = {
  params: {
    code: string;
    platform: string;
  };
} & Payload;
export type SignInWithWeChatResponseData = {
  token: string;
  id: number;
};

export type SignInWithGoogleIDTokenPayload = {
  params: {
    id_token: string;
  };
} & Payload;
export type SignInWithGoogleIDTokenResponseData = {
  token: string;
};

export type SignInWithFacebookPayload = {
  params: {
    accessToken: string;
  };
} & Payload;
export type SignInWithFacebookResponseData = {
  token: string;
};

export type FetchUserPayload = Payload;
export type FetchUserResponseData = {
  id: number;
  avatar: string;
  banner: string;
  banner_mobile: string;
  realname: string;
  nickname: string;
  username: string;
  describe: string;
  email: string;
  phone: string;
  country_code: string;
  sex: number;
  birth_time: string;
  birthday: string;
  age: string;
  region: {
    id: number;
    title: string;
    short_name: string;
    img_url: string;
    flag: string;
    currency: string;
  };
  merchant_location: {
    id: number;
    title: string;
    label_name: string;
  } | null;
  shop: number;
  token: string;
  newsletter_swapifly: BooleanNumber;
  newsletter_partners: BooleanNumber;
};

export type SignUpPayload = {
  params: {
    email: string;
    code: string;
    key: string;
    password: string;
    newsletter_swapifly?: BooleanNumber;
    newsletter_partners?: BooleanNumber;
  };
} & Payload;

export type FetchUserLabelsPayload = {
  params?: {
    limit?: number;
  };
} & Payload;
export type FetchUserLabelsResponseData = {
  data: {
    id: number;
    title: string;
    type: BooleanNumber;
  }[];
  pagination: {
    total: number;
    total_page: number;
    current_page: number;
    per_page: number;
  };
};

export type UpdateUserLabelPayload = {
  params: {
    rid: number[];
  };
} & Payload;

export type ResetPasswordPayload = {
  params: {
    email: string;
    code: string;
    key: string;
    password: string;
    checkpassword: string;
  };
} & Payload;

export type FetchUserShopPayload = Payload;
export type FetchUserShopResponseData = {
  id: number;
  title: string;
  address: string;
  contact: string;
  website: string;
  state: number;
  image: string;
  online_shop_verified: BooleanNumber;
  physical_address_verified: BooleanNumber;
  existing_br_verified: BooleanNumber;
  merchant_location: {
    id: number;
    label_name: string;
    title: string;
    region_id: number;
  } | null;
};

export type SubmitUserShopVerificationRequestPayload = {
  params: {
    title: string;
    address: string;
    contact: string;
    website: string;
    image: string;
    merchant_location_id?: number;
  };
} & Payload;

export type UpdateUserShopPayload = {
  params: {
    id: number;
    title: string;
    address: string;
    contact: string;
    website: string;
    image: string;
    merchant_location_id?: number;
  };
} & Payload;

export type FetchUserLoginInfoPayload = Payload;
export type FetchUserLoginInfoResponseData = {
  count_login_methods: number;
  login_email: boolean;
  login_google: boolean;
  login_facebook: boolean;
  login_apple: boolean;
  login_wechat: boolean;
};

export type BindFacebookPayload = {
  params: {
    accessToken: string;
  };
} & Payload;

export type UnbindFacebookPayload = Payload;

export type BindGooglePayload = {
  params: {
    code: string;
  };
} & Payload;

export type BindWeChatPayload = {
  params: {
    code: string;
    platform: string;
  };
} & Payload;

export type UnbindGooglePayload = Payload;

export type UnbindWeChatPayload = Payload;

export type UnbindApplePayload = Payload;

export type UpdateUserPayload = {
  params: {
    nickname?: string;
    username?: string;
    avatar?: string;
    banner?: string;
    banner_mobile?: string;
    describe?: string;
    region?: number;
    sex?: number;
    birthday?: string;
    newsletter_swapifly?: number;
    newsletter_partners?: number;
  };
} & Payload;

export type UpdateUserMediaPayload = {
  params: {
    avatar?: string;
    banner?: string;
    banner_mobile?: string;
  };
} & Payload;

export type BindPhoneNumberPayload = {
  params: {
    phone: string;
    country_code: string;
    uid: string;
    id_token: string;
  };
} & Payload;

export type ChangePasswordPayload = {
  params: {
    old_password: string;
    new_password: string;
    new_password_confirmation: string;
  };
} & Payload;

export type ResetPasswordByPhoneNumberPayload = {
  params: {
    phone: string;
    country_code: string;
    password: string;
    password_confirmation: string;
    uid: string;
    id_token: string;
  };
} & Payload;

export type BindEmailPayload = {
  params: {
    email: string;
    code: string;
    key: string;
    password: string;
    checkpassword: string;
  };
} & Payload;

export type SignOutPayload = Payload;

export type SignInWithOneTimeTokenPayload = Payload;
export type SignInWithOneTimeTokenResponseData = {
  id: number;
  token: string;
};
