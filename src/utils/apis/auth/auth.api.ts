import { authAxios, commonAxios } from "@/libs/axios";

import type {
  SignInPayload,
  FetchUserPayload,
  SignUpPayload,
  FetchUserLabelsPayload,
  UpdateUserLabelPayload,
  FetchUserLabelsResponseData,
  FetchUserResponseData,
  ResetPasswordPayload,
  SignInWithGooglePayload,
  SignInWithFacebookPayload,
  SignInWithFacebookResponseData,
  SignInWithGoogleResponseData,
  SignInWithGoogleIDTokenPayload,
  SignInWithGoogleIDTokenResponseData,
  FetchUserShopPayload,
  FetchUserShopResponseData,
  SubmitUserShopVerificationRequestPayload,
  UpdateUserShopPayload,
  FetchUserLoginInfoPayload,
  FetchUserLoginInfoResponseData,
  BindFacebookPayload,
  UnbindFacebookPayload,
  BindGooglePayload,
  UnbindGooglePayload,
  UnbindApplePayload,
  UpdateUserPayload,
  UpdateUserMediaPayload,
  BindPhoneNumberPayload,
  ChangePasswordPayload,
  ResetPasswordByPhoneNumberPayload,
  SignInWithWeChatPayload,
  SignInWithWeChatResponseData,
  SignOutPayload,
  BindWeChatPayload,
  UnbindWeChatPayload,
  BindEmailPayload,
  SignInWithOneTimeTokenPayload,
  SignInWithOneTimeTokenResponseData,
} from "./auth.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const authApi = {
  signOut: (payload?: SignOutPayload) => {
    return authAxios.post<AxiosResponseData>("auth/logout", undefined, {
      cancelToken: payload?.cancelToken,
    });
  },
  signIn: (payload: SignInPayload) => {
    return commonAxios.post<AxiosResponseData>("auth/login", payload.params, {
      cancelToken: payload.cancelToken,
    });
  },
  signInWithOneTimeToken: (payload: SignInWithOneTimeTokenPayload) => {
    return commonAxios.post<
      AxiosResponseData<SignInWithOneTimeTokenResponseData>
    >("auth/one_time_token_login", undefined, {
      cancelToken: payload.cancelToken,
      headers: payload.headers,
    });
  },
  signInWithGoogle: (payload: SignInWithGooglePayload) => {
    return commonAxios.get<AxiosResponseData<SignInWithGoogleResponseData>>(
      "auth/google_login",
      {
        params: payload.params,
        cancelToken: payload.cancelToken,
      }
    );
  },
  signInWithGoogleIDToken: (payload: SignInWithGoogleIDTokenPayload) => {
    return commonAxios.post<
      AxiosResponseData<SignInWithGoogleIDTokenResponseData>
    >("auth/google_one_tap", payload.params, {
      cancelToken: payload.cancelToken,
    });
  },
  signInWithFacebook: (payload: SignInWithFacebookPayload) => {
    return commonAxios.get<AxiosResponseData<SignInWithFacebookResponseData>>(
      "auth/facebook_login",
      {
        params: payload.params,
        cancelToken: payload.cancelToken,
      }
    );
  },
  signInWithWeChat: (payload: SignInWithWeChatPayload) => {
    return commonAxios.post<AxiosResponseData<SignInWithWeChatResponseData>>(
      "auth/wechat_login",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  signUp: (payload: SignUpPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "register/register",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  fetchUser: (payload?: FetchUserPayload) => {
    return authAxios.get<AxiosResponseData<FetchUserResponseData>>(
      "auth/user_info",
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  fetchUserLabels: (payload?: FetchUserLabelsPayload) => {
    return authAxios.get<AxiosResponseData<FetchUserLabelsResponseData>>(
      "user/get_user_label",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchUserShop: (payload: FetchUserShopPayload) => {
    return authAxios.get<AxiosResponseData<FetchUserShopResponseData>>(
      `user/shop_detail`,
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  fetchUserLoginInfo: (payload?: FetchUserLoginInfoPayload) => {
    return authAxios.get<AxiosResponseData<FetchUserLoginInfoResponseData>>(
      `auth/login_info`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  submitUserShopVerificationRequest: (
    payload: SubmitUserShopVerificationRequestPayload
  ) => {
    return authAxios.post<AxiosResponseData>(
      `user/shop_verification`,
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  updateUserShop: (payload: UpdateUserShopPayload) => {
    return authAxios.post<AxiosResponseData>(
      `user/shop_update`,
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  resetPassword: (payload: ResetPasswordPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "register/reset_pwd",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  resetPasswordByPhoneNumber: (payload: ResetPasswordByPhoneNumberPayload) => {
    return commonAxios.post<AxiosResponseData>(
      "register/reset_pwd_by_phone",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  changePassword: (payload: ChangePasswordPayload) => {
    return authAxios.post<AxiosResponseData>(
      "auth/change_password",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  updateUserLabel: (payload: UpdateUserLabelPayload) => {
    return authAxios.post<AxiosResponseData>(
      "user/update_user_label",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  updateUser: (payload: UpdateUserPayload) => {
    return authAxios.put<AxiosResponseData>(
      "user/profile_update",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  updateUserMedia: (payload: UpdateUserMediaPayload) => {
    return authAxios.put<AxiosResponseData>(
      "user/media_update",
      payload.params,
      {
        cancelToken: payload.cancelToken,
      }
    );
  },
  bindFacebook: (payload: BindFacebookPayload) => {
    return authAxios.get<AxiosResponseData>("auth/facebook_link", {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
  bindGoogle: (payload: BindGooglePayload) => {
    return authAxios.get<AxiosResponseData>("auth/google_link", {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
  bindWeChat: (payload: BindWeChatPayload) => {
    return authAxios.post<AxiosResponseData>(
      "auth/wechat_link",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  bindPhoneNumber: (payload: BindPhoneNumberPayload) => {
    return authAxios.post<AxiosResponseData>("user/add_phone", payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  bindEmail: (payload: BindEmailPayload) => {
    return authAxios.post<AxiosResponseData>(
      "user/update_email",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  unbindFacebook: (payload?: UnbindFacebookPayload) => {
    return authAxios.put<AxiosResponseData>("auth/facebook_unlink", undefined, {
      cancelToken: payload?.cancelToken,
    });
  },
  unbindGoogle: (payload?: UnbindGooglePayload) => {
    return authAxios.put<AxiosResponseData>("auth/google_unlink", undefined, {
      cancelToken: payload?.cancelToken,
    });
  },
  unbindWeChat: (payload?: UnbindWeChatPayload) => {
    return authAxios.put<AxiosResponseData>("auth/wechat_unlink", undefined, {
      cancelToken: payload?.cancelToken,
    });
  },
  unbindApple: (payload?: UnbindApplePayload) => {
    return authAxios.put<AxiosResponseData>("auth/apple_unlink", undefined, {
      cancelToken: payload?.cancelToken,
    });
  },
};

export default authApi;
