import type {
  FetchCookieTokenPayload,
  FetchRegionsPayload,
  FetchRegionsResponseData,
  FetchSettingsPayload,
  FetchTermsOfServiceAndPrivacyPolicyPayload,
} from "@/utils/apis/common";

// Action Types

export enum CommonActionTypes {
  FETCH_REQUESTED = "@@common/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@common/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@common/FETCH_FAILED",

  SET_SEARCH = "@@common/SET_SEARCH",
  SET_REGION = "@@common/SET_REGION",
  SET_LOCATION = "@@common/SET_LOCATION",
  // Saga
  FETCH_COOKIE_TOKEN_SAGA = "@@common/FETCH_COOKIE_TOKEN_SAGA",
  FETCH_SETTINGS_SAGA = "@@common/FETCH_SETTINGS_SAGA",
  FETCH_REGIONS_SAGA = "@@common/FETCH_REGIONS_SAGA",
  FETCH_TERM_OF_SERVICE_AND_PRIVACY_POLICY_SAGA = "@@common/FETCH_TERM_OF_SERVICE_AND_PRIVACY_POLICY_SAGA",
}

// State

export interface CommonState {
  cookieToken: string;
  cookieTokenLoading: boolean;
  cookieTokenError: string;

  region: Partial<FetchRegionsResponseData[number]> | null;
  search: string;
  location: {
    latitude: EmptySafeNumber;
    longitude: EmptySafeNumber;
  };

  termsOfServiceAndPrivacyPolicy: {
    privacyPolicy: string;
    termsOfService: string;
  };
  termsOfServiceAndPrivacyPolicyLoading: boolean;
  termsOfServiceAndPrivacyPolicyError: string;

  settings: {
    search_min_length: number;

    resend_email_code_time: number;
    reset_pwd_resend_email_code_time: number;

    reset_pwd_resend_otp_code_time: number;
    bind_phone_resend_otp_code_time: number;

    search_history_max_records: number;

    desktop_home_banner_resolution_width: number;
    desktop_home_banner_resolution_height: number;
    mobile_home_banner_resolution_width: number;
    mobile_home_banner_resolution_height: number;
  };
  settingsLoading: boolean;
  settingsError: string;

  regions: FetchRegionsResponseData;
  regionsLoading: boolean;
  regionsError: string;
}

// ---- Reducer ----

export type FetchScope =
  | "settings"
  | "regions"
  | "cookieToken"
  | "termsOfServiceAndPrivacyPolicy";

export type FetchRequestedAction = {
  type: CommonActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
  };
};

export type FetchSucceededAction = {
  type: CommonActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: Partial<CommonState[FetchScope]>;
    count?: number;
  };
};

export type FetchFailedAction = {
  type: CommonActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type SetSearchAction = {
  type: CommonActionTypes.SET_SEARCH;
  payload: CommonState["search"];
};

export type SetRegionAction = {
  type: CommonActionTypes.SET_REGION;
  payload: CommonState["region"];
};

export type SetLocationAction = {
  type: CommonActionTypes.SET_LOCATION;
  payload: CommonState["location"];
};

// ---- Saga ----

export type FetchCookieTokenSagaAction = {
  type: CommonActionTypes.FETCH_COOKIE_TOKEN_SAGA;
  payload?: FetchCookieTokenPayload;
  meta?: {
    resolve?: Function;
  };
};

export type FetchSettingsSagaAction = {
  type: CommonActionTypes.FETCH_SETTINGS_SAGA;
  payload?: FetchSettingsPayload;
  meta?: {
    resolve?: Function;
  };
};

export type FetchRegionsSagaAction = {
  type: CommonActionTypes.FETCH_REGIONS_SAGA;
  payload?: FetchRegionsPayload;
  meta?: {
    resolve?: Function;
  };
};

export type FetchTermsOfServiceAndPrivacyPolicySagaAction = {
  type: CommonActionTypes.FETCH_TERM_OF_SERVICE_AND_PRIVACY_POLICY_SAGA;
  payload?: FetchTermsOfServiceAndPrivacyPolicyPayload;
  meta?: {
    resolve?: Function;
  };
};

export type CommonAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | SetSearchAction
  | SetRegionAction
  | SetLocationAction
  //
  | FetchCookieTokenSagaAction
  | FetchRegionsSagaAction
  | FetchSettingsSagaAction
  | FetchTermsOfServiceAndPrivacyPolicySagaAction;
