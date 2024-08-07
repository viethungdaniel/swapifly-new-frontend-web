import { AuthActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  SignOutSucceededAction,
  CheckAuthRequestedAction,
  CheckAuthFailedAction,
  CheckAuthSucceededAction,
  SignInSucceededAction,
  UpdateUserLabelSucceededAction,
  SetUserLoginInfoMediaSocialBindingAction,
  UpdateUserAction,
  BindEmailSucceededAction,
  // Saga
  SignOutSagaAction,
  SignOutOnExpiredTokenSagaAction,
  SignInSagaAction,
  CheckAuthSagaAction,
  FetchUserSagaAction,
  SignUpSagaAction,
  UpdateUserLabelSagaAction,
  FetchUserLabelsSagaAction,
  SignInWithGoogleSagaAction,
  SignInWithGoogleIDTokenSagaAction,
  SignInWithFacebookSagaAction,
  FetchUserShopSagaAction,
  FetchUserLoginInfoSagaAction,
  BindFacebookSagaAction,
  BindGoogleSagaAction,
  BindPhoneNumberSagaAction,
  BindEmailSagaAction,
  UnbindAppleSagaAction,
  UnbindWeChatSagaAction,
  UnbindFacebookSagaAction,
  UnbindGoogleSagaAction,
  UpdateUserMediaSagaAction,
  UpdateUserSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: AuthActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: AuthActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: AuthActionTypes.FETCH_FAILED,
  payload,
});

export const checkAuthRequested = (): CheckAuthRequestedAction => ({
  type: AuthActionTypes.CHECK_AUTH_REQUESTED,
});

export const checkAuthSucceeded = (
  payload: CheckAuthSucceededAction["payload"]
): CheckAuthSucceededAction => ({
  type: AuthActionTypes.CHECK_AUTH_SUCCEEDED,
  payload,
});

export const checkAuthFailed = (
  payload: CheckAuthFailedAction["payload"]
): CheckAuthFailedAction => ({
  type: AuthActionTypes.CHECK_AUTH_FAILED,
  payload,
});

export const signOutSucceeded = (
  payload?: SignOutSucceededAction["payload"]
): SignOutSucceededAction => ({
  type: AuthActionTypes.SIGN_OUT_SUCCEEDED,
  payload,
});

export const signInSucceeded = (
  payload: SignInSucceededAction["payload"]
): SignInSucceededAction => ({
  type: AuthActionTypes.SIGN_IN_SUCCEEDED,
  payload,
});

export const updateUserLabelSucceeded = (
  payload: UpdateUserLabelSucceededAction["payload"]
): UpdateUserLabelSucceededAction => ({
  type: AuthActionTypes.UPDATE_USER_LABEL_SUCCEEDED,
  payload,
});

export const setUserLoginInfoMediaSocialBinding = (
  payload: SetUserLoginInfoMediaSocialBindingAction["payload"]
): SetUserLoginInfoMediaSocialBindingAction => ({
  type: AuthActionTypes.SET_USER_LOGIN_INFO_MEDIAL_SOCIAL_BINDING_STATE,
  payload,
});

export const updateUser = (
  payload: UpdateUserAction["payload"]
): UpdateUserAction => ({
  type: AuthActionTypes.UPDATE_USER,
  payload,
});

export const bindEmailSucceeded = (
  payload: BindEmailSucceededAction["payload"]
): BindEmailSucceededAction => ({
  type: AuthActionTypes.BIND_EMAIL_SUCCEEDED,
  payload,
});

// ---- SAGA ACTION ----

export const signInSaga = (
  payload: SignInSagaAction["payload"],
  meta?: SignInSagaAction["meta"]
): SignInSagaAction => ({
  type: AuthActionTypes.SIGN_IN_SAGA,
  payload,
  meta,
});

export const signInWithGoogleSaga = (
  payload: SignInWithGoogleSagaAction["payload"],
  meta?: SignInWithGoogleSagaAction["meta"]
): SignInWithGoogleSagaAction => ({
  type: AuthActionTypes.SIGN_IN_WITH_GOOGLE_SAGA,
  payload,
  meta,
});

export const signInWithGoogleIDTokenSaga = (
  payload: SignInWithGoogleIDTokenSagaAction["payload"],
  meta?: SignInWithGoogleIDTokenSagaAction["meta"]
): SignInWithGoogleIDTokenSagaAction => ({
  type: AuthActionTypes.SIGN_IN_WITH_GOOGLE_ID_TOKEN_SAGA,
  payload,
  meta,
});

export const signInWithFacebookSaga = (
  payload: SignInWithFacebookSagaAction["payload"],
  meta?: SignInWithFacebookSagaAction["meta"]
): SignInWithFacebookSagaAction => ({
  type: AuthActionTypes.SIGN_IN_WITH_FACEBOOK_SAGA,
  payload,
  meta,
});

export const signUpSaga = (
  payload: SignUpSagaAction["payload"],
  meta?: SignUpSagaAction["meta"]
): SignUpSagaAction => ({
  type: AuthActionTypes.SIGN_UP_SAGA,
  payload,
  meta,
});

export const fetchUserSaga = (
  payload?: FetchUserSagaAction["payload"],
  meta?: FetchUserSagaAction["meta"]
): FetchUserSagaAction => ({
  type: AuthActionTypes.FETCH_USER_SAGA,
  payload,
  meta,
});

export const fetchUserLabelsSaga = (
  payload?: FetchUserLabelsSagaAction["payload"],
  meta?: FetchUserLabelsSagaAction["meta"]
): FetchUserLabelsSagaAction => ({
  type: AuthActionTypes.FETCH_USER_LABELS_SAGA,
  payload,
  meta,
});

export const updateUserLabelsSaga = (
  payload: UpdateUserLabelSagaAction["payload"],
  meta?: UpdateUserLabelSagaAction["meta"]
): UpdateUserLabelSagaAction => ({
  type: AuthActionTypes.UPDATE_USER_LABELS_SAGA,
  payload,
  meta,
});

export const checkAuthSaga = (): CheckAuthSagaAction => ({
  type: AuthActionTypes.CHECK_AUTH_SAGA,
});

export const fetchUserShopSaga = (
  payload?: FetchUserShopSagaAction["payload"],
  meta?: FetchUserShopSagaAction["meta"]
): FetchUserShopSagaAction => ({
  type: AuthActionTypes.FETCH_USER_SHOP_SAGA,
  payload,
  meta,
});

export const fetchUserLoginInfoSaga = (
  payload?: FetchUserLoginInfoSagaAction["payload"],
  meta?: FetchUserLoginInfoSagaAction["meta"]
): FetchUserLoginInfoSagaAction => ({
  type: AuthActionTypes.FETCH_USER_LOGIN_INFO_SAGA,
  payload,
  meta,
});

export const bindFacebookSaga = (
  payload: BindFacebookSagaAction["payload"],
  meta?: BindFacebookSagaAction["meta"]
): BindFacebookSagaAction => ({
  type: AuthActionTypes.BIND_FACEBOOK_SAGA,
  payload,
  meta,
});

export const bindGoogleSaga = (
  payload: BindGoogleSagaAction["payload"],
  meta?: BindGoogleSagaAction["meta"]
): BindGoogleSagaAction => ({
  type: AuthActionTypes.BIND_GOOGLE_SAGA,
  payload,
  meta,
});

export const bindPhoneNumberSaga = (
  payload: BindPhoneNumberSagaAction["payload"],
  meta?: BindPhoneNumberSagaAction["meta"]
): BindPhoneNumberSagaAction => ({
  type: AuthActionTypes.BIND_PHONE_NUMBER_SAGA,
  payload,
  meta,
});

export const bindEmailSaga = (
  payload: BindEmailSagaAction["payload"],
  meta?: BindEmailSagaAction["meta"]
): BindEmailSagaAction => ({
  type: AuthActionTypes.BIND_EMAIL_SAGA,
  payload,
  meta,
});

export const unbindAppleSaga = (
  payload?: UnbindAppleSagaAction["payload"],
  meta?: UnbindAppleSagaAction["meta"]
): UnbindAppleSagaAction => ({
  type: AuthActionTypes.UNBIND_APPLE_SAGA,
  payload,
  meta,
});

export const unbindWeChatSaga = (
  payload?: UnbindWeChatSagaAction["payload"],
  meta?: UnbindWeChatSagaAction["meta"]
): UnbindWeChatSagaAction => ({
  type: AuthActionTypes.UNBIND_WECHAT_SAGA,
  payload,
  meta,
});

export const unbindFacebookSaga = (
  payload?: UnbindFacebookSagaAction["payload"],
  meta?: UnbindFacebookSagaAction["meta"]
): UnbindFacebookSagaAction => ({
  type: AuthActionTypes.UNBIND_FACEBOOK_SAGA,
  payload,
  meta,
});

export const unbindGoogleSaga = (
  payload?: UnbindGoogleSagaAction["payload"],
  meta?: UnbindGoogleSagaAction["meta"]
): UnbindGoogleSagaAction => ({
  type: AuthActionTypes.UNBIND_GOOGLE_SAGA,
  payload,
  meta,
});

export const updateUserMediaSaga = (
  payload: UpdateUserMediaSagaAction["payload"],
  meta?: UpdateUserMediaSagaAction["meta"]
): UpdateUserMediaSagaAction => ({
  type: AuthActionTypes.UPDATE_USER_MEDIA_SAGA,
  payload,
  meta,
});

export const updateUserSaga = (
  payload: UpdateUserSagaAction["payload"],
  meta?: UpdateUserSagaAction["meta"]
): UpdateUserSagaAction => ({
  type: AuthActionTypes.UPDATE_USER_SAGA,
  payload,
  meta,
});

export const signOutSaga = (
  payload?: SignOutSagaAction["payload"],
  meta?: SignOutSagaAction["meta"]
): SignOutSagaAction => ({
  type: AuthActionTypes.SIGN_OUT_SAGA,
  payload,
  meta,
});

export const signOutOnExpiredTokenSaga =
  (): SignOutOnExpiredTokenSagaAction => ({
    type: AuthActionTypes.SIGN_OUT_ON_EXPIRED_TOKEN_SAGA,
  });
