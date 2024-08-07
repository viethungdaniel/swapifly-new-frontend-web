import type { CancelToken } from "axios";

type Payload = {
  cancelToken?: CancelToken;
};

export type FetchSettingsPayload = Payload;
export type FetchSettingsResponseData = {
  search: {
    min_length: number;
    max_number_of_history_search: number;
  };
  register: {
    resend_email_code_time: number;
    reset_pwd_resend_email_code_time: number;
  };
  banner: {
    desktop_home_banner_width: number;
    desktop_home_banner_height: number;
    mobile_home_banner_width: number;
    mobile_home_banner_height: number;
  };
};

export type FetchRegionsPayload = Payload;
export type FetchRegionsResponseData = {
  id: number;
  title: string;
  title_en: string;
  title_cn: string;
  title_ja: string;
  title_ko: string;
  short_name: string;
  img_url: string;
  flag: string;
  currency: string;
}[];

export type FetchSearchHistoriesPayload = Payload;
export type FetchSearchHistoriesResponseData = {
  id: number;
  title: string;
  num: number;
  collect: number;
}[];

export type SaveSubmittedSearchHistoryPayload = {
  params: {
    title: string;
  };
} & Payload;

export type ClearSearchHistoryPayload = Payload;

export type RemoveSearchHistoryPayload = {
  params: {
    id: SafeNumber;
  };
} & Payload;

export type SendRegistrationEmailVerificationCodePayload = {
  params: {
    email: string;
  };
} & Payload;

export type SendPasswordResetEmailVerificationCodePayload = {
  params: {
    email: string;
  };
} & Payload;

export type FetchCookieTokenPayload = Payload;

export type RecordPageAnalyticsPayload = {
  params: {
    token?: string;
    product_id?: EmptySafeNumber;
    category_id?: EmptySafeNumber;
    user_agent?: string;
    lat?: EmptySafeNumber;
    lng?: EmptySafeNumber;
    region?: string;
    page_path?: string;
    json_google_location?: string;
    json_google_geodecoding?: string;
    mobile_os?: string;
    mobile_model?: string;
    mobile_udid?: string;
    mobile_app_version?: string;
  };
} & Payload;

export type UploadFilePayload = {
  params: {
    file: File;
    type: string;
  };
} & Payload;

export type UploadVideoFilePayload = {
  params: {
    file: File;
  };
} & Payload;

export type FetchTermsOfServiceAndPrivacyPolicyPayload = Payload;
export type FetchTermsOfServiceAndPrivacyPolicyResponseData = {
  term: {
    id: number;
    title: string;
    details: string;
  };
  policy: {
    id: number;
    title: string;
    details: string;
  };
};

export type FetchLocationsPayload = {
  params: {
    query: string;
    lat?: EmptySafeNumber;
    lng?: EmptySafeNumber;
  };
} & Payload;
export type FetchLocationsResponseData = {
  title: string;
  address: string;
  lat: number;
  lng: number;
}[];

export type ValidatePhoneNumberExistedPayload = {
  params: {
    phone: string;
    country_code: string;
  };
} & Payload;
export type ValidatePhoneNumberExistedResponseData = {
  is_existed: boolean;
};

export type RegisterFirebaseNotificationDevicePayload = {
  params: {
    platform: string; // android
    fcm_id: string; // {{firebase_messaging_token}};
    language?: string; // en-us
    os_version?: string;
    phone_model?: string; // Samsung A71
    phone_udid?: string; // "phone_udid";
    app_version?: string; // "4.5.6";
  };
} & Payload;

export type SendBindEmailVerificationCodePayload = {
  params: {
    email: string;
  };
} & Payload;

export type FetchMerchantLocationsPayload = {
  params?: {
    region_id?: number;
  };
} & Payload;
export type FetchMerchantLocationsResponseData = {
  id: number;
  title: string;
  label_name: string;
}[];
