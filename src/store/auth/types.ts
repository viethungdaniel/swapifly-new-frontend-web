import type {
  SignInPayload,
  FetchUserResponseData,
  FetchUserPayload,
  SignUpPayload,
  FetchUserLabelsResponseData,
  FetchUserLabelsPayload,
  UpdateUserLabelPayload,
  SignInWithGooglePayload,
  SignInWithFacebookPayload,
  SignInWithGoogleIDTokenPayload,
  FetchUserShopResponseData,
  FetchUserShopPayload,
  FetchUserLoginInfoResponseData,
  FetchUserLoginInfoPayload,
  BindFacebookPayload,
  UnbindFacebookPayload,
  BindGooglePayload,
  UnbindGooglePayload,
  UpdateUserMediaPayload,
  UpdateUserPayload,
  BindPhoneNumberPayload,
  UnbindWeChatPayload,
  BindEmailPayload,
  SignOutPayload,
} from "@/utils/apis/auth";

export enum AuthActionTypes {
  SIGN_IN_SUCCEEDED = "@@auth/SIGN_IN_SUCCEEDED",
  SIGN_OUT_SUCCEEDED = "@@auth/SIGN_OUT_SUCCEEDED",

  CHECK_AUTH_REQUESTED = "@@auth/CHECK_AUTH_REQUESTED",
  CHECK_AUTH_SUCCEEDED = "@@auth/CHECK_AUTH_SUCCEEDED",
  CHECK_AUTH_FAILED = "@@auth/CHECK_AUTH_FAILED",

  FETCH_REQUESTED = "@@auth/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@auth/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@auth/FETCH_FAILED",

  UPDATE_USER_LABEL_SUCCEEDED = "@@auth/UPDATE_USER_LABEL_SUCCEEDED",
  BIND_EMAIL_SUCCEEDED = "@@auth/BIND_EMAIL_SUCCEEDED",

  UPDATE_USER = "@@auth/UPDATE_USER",

  SET_USER_LOGIN_INFO_MEDIAL_SOCIAL_BINDING_STATE = "@@auth/SET_USER_LOGIN_INFO_FACEBOOK_BINDING_STATE",

  // Saga
  CHECK_AUTH_SAGA = "@@auth/CHECK_AUTH_SAGA",
  SIGN_OUT_SAGA = "@@auth/SIGN_OUT_SAGA",
  SIGN_OUT_ON_EXPIRED_TOKEN_SAGA = "@@auth/SIGN_OUT_ON_EXPIRED_TOKEN_SAGA",
  SIGN_IN_SAGA = "@@auth/SIGN_IN_SAGA",
  SIGN_IN_WITH_GOOGLE_SAGA = "@@auth/SIGN_IN_WITH_GOOGLE_SAGA",
  SIGN_IN_WITH_GOOGLE_ID_TOKEN_SAGA = "@@auth/SIGN_IN_WITH_GOOGLE_ID_TOKEN_SAGA",
  SIGN_IN_WITH_FACEBOOK_SAGA = "@@auth/SIGN_IN_WITH_FACEBOOK_SAGA",
  SIGN_UP_SAGA = "@@auth/SIGN_UP_SAGA",
  FETCH_USER_SAGA = "@@auth/FETCH_USER_SAGA",
  FETCH_USER_SHOP_SAGA = "@@auth/FETCH_USER_SHOP_SAGA",
  FETCH_USER_LABELS_SAGA = "@@auth/FETCH_USER_LABELS_SAGA",
  UPDATE_USER_SAGA = "@@auth/UPDATE_USER_SAGA",
  UPDATE_USER_LABELS_SAGA = "@@auth/UPDATE_USER_LABELS_SAGA",
  UPDATE_USER_MEDIA_SAGA = "@@auth/UPDATE_USER_MEDIA_SAGA",
  FETCH_USER_LOGIN_INFO_SAGA = "@@auth/FETCH_USER_LOGIN_INFO_SAGA",
  BIND_FACEBOOK_SAGA = "@@auth/BIND_FACEBOOK_SAGA",
  UNBIND_FACEBOOK_SAGA = "@@auth/UNBIND_FACEBOOK_SAGA",
  BIND_GOOGLE_SAGA = "@@auth/BIND_GOOGLE_SAGA",
  UNBIND_GOOGLE_SAGA = "@@auth/UNBIND_GOOGLE_SAGA",
  UNBIND_APPLE_SAGA = "@@auth/UNBIND_APPLE_SAGA",
  UNBIND_WECHAT_SAGA = "@@auth/UNBIND_WECHAT_SAGA",
  BIND_PHONE_NUMBER_SAGA = "@@auth/BIND_PHONE_NUMBER_SAGA",
  BIND_EMAIL_SAGA = "@@auth/BIND_EMAIL_SAGA",
}

// State

export interface AuthState {
  user: FetchUserResponseData | null;
  userAuthChecking: boolean;
  userAuthCheckingError: string;
  userLoading: boolean;
  userError: "";
  isUserAuthExpiredToken: boolean;

  userLoginInfo: FetchUserLoginInfoResponseData | null;
  userLoginInfoError: string;
  userLoginInfoLoading: boolean;

  userLabels: FetchUserLabelsResponseData["data"];
  userLabelsLoading: boolean;
  userLabelsError: string;

  userShop: FetchUserShopResponseData | null;
  userShopLoading: boolean;
  userShopError: string;
}

// ---- Reducer Action ----

export type FetchScope = "user" | "userLabels" | "userShop" | "userLoginInfo";

export type FetchRequestedAction = {
  type: AuthActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
  };
};

export type FetchSucceededAction = {
  type: AuthActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: AuthState[FetchScope];
    count?: number;
  };
};

export type FetchFailedAction = {
  type: AuthActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type SignInSucceededAction = {
  type: AuthActionTypes.SIGN_IN_SUCCEEDED;
  payload: FetchUserResponseData;
};

export type CheckAuthRequestedAction = {
  type: AuthActionTypes.CHECK_AUTH_REQUESTED;
};

export type CheckAuthFailedAction = {
  type: AuthActionTypes.CHECK_AUTH_FAILED;
  payload: {
    message: string;
    isNetworkError?: boolean;
  };
};

export type CheckAuthSucceededAction = {
  type: AuthActionTypes.CHECK_AUTH_SUCCEEDED;
  payload: AuthState["user"] | null;
};

export type SignOutSucceededAction = {
  type: AuthActionTypes.SIGN_OUT_SUCCEEDED;
  payload?: {
    reason?: string;
  };
};

export type UpdateUserLabelSucceededAction = {
  type: AuthActionTypes.UPDATE_USER_LABEL_SUCCEEDED;
  payload: number[];
};

export type SetUserLoginInfoMediaSocialBindingAction = {
  type: AuthActionTypes.SET_USER_LOGIN_INFO_MEDIAL_SOCIAL_BINDING_STATE;
  payload: {
    mediaSocial: "facebook" | "google" | "apple" | "wechat";
    value: boolean;
  };
};

export type UpdateUserAction = {
  type: AuthActionTypes.UPDATE_USER;
  payload: Partial<NonNullable<AuthState["user"]>>;
};

export type BindEmailSucceededAction = {
  type: AuthActionTypes.BIND_EMAIL_SUCCEEDED;
  payload: {
    email: string;
  };
};

// ---- Saga Action ----

export type FetchUserSagaAction = {
  type: AuthActionTypes.FETCH_USER_SAGA;
  payload?: FetchUserPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchUserLabelsSagaAction = {
  type: AuthActionTypes.FETCH_USER_LABELS_SAGA;
  payload?: FetchUserLabelsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type SignOutSagaAction = {
  type: AuthActionTypes.SIGN_OUT_SAGA;
  payload?: SignOutPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type SignOutOnExpiredTokenSagaAction = {
  type: AuthActionTypes.SIGN_OUT_ON_EXPIRED_TOKEN_SAGA;
};

export type SignInSagaAction = {
  type: AuthActionTypes.SIGN_IN_SAGA;
  payload: SignInPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type SignInWithGoogleSagaAction = {
  type: AuthActionTypes.SIGN_IN_WITH_GOOGLE_SAGA;
  payload: SignInWithGooglePayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type SignInWithGoogleIDTokenSagaAction = {
  type: AuthActionTypes.SIGN_IN_WITH_GOOGLE_ID_TOKEN_SAGA;
  payload: SignInWithGoogleIDTokenPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type SignInWithFacebookSagaAction = {
  type: AuthActionTypes.SIGN_IN_WITH_FACEBOOK_SAGA;
  payload: SignInWithFacebookPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type SignUpSagaAction = {
  type: AuthActionTypes.SIGN_UP_SAGA;
  payload: SignUpPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchUserShopSagaAction = {
  type: AuthActionTypes.FETCH_USER_SHOP_SAGA;
  payload?: FetchUserShopPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UpdateUserLabelSagaAction = {
  type: AuthActionTypes.UPDATE_USER_LABELS_SAGA;
  payload: UpdateUserLabelPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchUserLoginInfoSagaAction = {
  type: AuthActionTypes.FETCH_USER_LOGIN_INFO_SAGA;
  payload?: FetchUserLoginInfoPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type CheckAuthSagaAction = {
  type: AuthActionTypes.CHECK_AUTH_SAGA;
};

export type BindFacebookSagaAction = {
  type: AuthActionTypes.BIND_FACEBOOK_SAGA;
  payload: BindFacebookPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UnbindFacebookSagaAction = {
  type: AuthActionTypes.UNBIND_FACEBOOK_SAGA;
  payload?: UnbindFacebookPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type BindGoogleSagaAction = {
  type: AuthActionTypes.BIND_GOOGLE_SAGA;
  payload: BindGooglePayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type BindPhoneNumberSagaAction = {
  type: AuthActionTypes.BIND_PHONE_NUMBER_SAGA;
  payload: BindPhoneNumberPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type BindEmailSagaAction = {
  type: AuthActionTypes.BIND_EMAIL_SAGA;
  payload: BindEmailPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UnbindGoogleSagaAction = {
  type: AuthActionTypes.UNBIND_GOOGLE_SAGA;
  payload?: UnbindGooglePayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UnbindAppleSagaAction = {
  type: AuthActionTypes.UNBIND_APPLE_SAGA;
  payload?: UnbindGooglePayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UnbindWeChatSagaAction = {
  type: AuthActionTypes.UNBIND_WECHAT_SAGA;
  payload?: UnbindWeChatPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UpdateUserMediaSagaAction = {
  type: AuthActionTypes.UPDATE_USER_MEDIA_SAGA;
  payload: UpdateUserMediaPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UpdateUserSagaAction = {
  type: AuthActionTypes.UPDATE_USER_SAGA;
  payload: UpdateUserPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type AuthAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | CheckAuthRequestedAction
  | CheckAuthSucceededAction
  | CheckAuthFailedAction
  | SignInSucceededAction
  | SignOutSucceededAction
  | UpdateUserLabelSucceededAction
  | SetUserLoginInfoMediaSocialBindingAction
  | UpdateUserAction
  | BindEmailSucceededAction
  //
  | CheckAuthSagaAction
  | SignOutSagaAction
  | SignOutOnExpiredTokenSagaAction
  | SignInSagaAction
  | SignInWithGoogleSagaAction
  | SignInWithGoogleIDTokenSagaAction
  | SignInWithFacebookSagaAction
  | SignUpSagaAction
  | UpdateUserLabelSagaAction
  | FetchUserLoginInfoSagaAction
  | FetchUserShopSagaAction
  | FetchUserSagaAction
  | FetchUserLabelsSagaAction
  | BindFacebookSagaAction
  | UnbindFacebookSagaAction
  | BindGoogleSagaAction
  | BindPhoneNumberSagaAction
  | BindEmailSagaAction
  | UnbindGoogleSagaAction
  | UnbindAppleSagaAction
  | UnbindWeChatSagaAction
  | UpdateUserMediaSagaAction
  | UpdateUserSagaAction;
