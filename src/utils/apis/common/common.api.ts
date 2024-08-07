import { authAxios, commonAxios } from "@/libs/axios";
import { commonHelpers } from "@/utils/helpers";

import type {
  FetchSettingsPayload,
  FetchRegionsPayload,
  FetchSearchHistoriesPayload,
  SaveSubmittedSearchHistoryPayload,
  ClearSearchHistoryPayload,
  FetchCookieTokenPayload,
  RecordPageAnalyticsPayload,
  RemoveSearchHistoryPayload,
  SendRegistrationEmailVerificationCodePayload,
  SendPasswordResetEmailVerificationCodePayload,
  UploadFilePayload,
  UploadVideoFilePayload,
  FetchTermsOfServiceAndPrivacyPolicyPayload,
  FetchTermsOfServiceAndPrivacyPolicyResponseData,
  FetchLocationsPayload,
  FetchLocationsResponseData,
  ValidatePhoneNumberExistedPayload,
  ValidatePhoneNumberExistedResponseData,
  RegisterFirebaseNotificationDevicePayload,
  SendBindEmailVerificationCodePayload,
  FetchMerchantLocationsPayload,
  FetchMerchantLocationsResponseData,
} from "./common.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const commonApi = {
  fetchSettings: (payload?: FetchSettingsPayload) => {
    return commonAxios.get<AxiosResponseData>("common/config", {
      cancelToken: payload?.cancelToken,
    });
  },
  fetchMerchantLocations: (payload: FetchMerchantLocationsPayload) => {
    return commonAxios.get<
      AxiosResponseData<FetchMerchantLocationsResponseData>
    >("merchant_location/index", {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
  fetchLocations: (payload: FetchLocationsPayload) => {
    return commonAxios.get<AxiosResponseData<FetchLocationsResponseData>>(
      "google/place/nearbysearch",
      {
        params: payload.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchRegions: (payload?: FetchRegionsPayload) => {
    return commonAxios.get<AxiosResponseData>("region/index_by_language", {
      cancelToken: payload?.cancelToken,
    });
  },
  fetchSearchHistories: (payload?: FetchSearchHistoriesPayload) => {
    return authAxios.get<AxiosResponseData>("user/get_history_search", {
      cancelToken: payload?.cancelToken,
    });
  },
  fetchCookieToken: (payload?: FetchCookieTokenPayload) => {
    return authAxios.get<AxiosResponseData<string>>("common/get_cookie_token", {
      cancelToken: payload?.cancelToken,
    });
  },
  fetchTermsOfServiceAndPrivacyPolicy: (
    payload?: FetchTermsOfServiceAndPrivacyPolicyPayload
  ) => {
    return authAxios.get<
      AxiosResponseData<FetchTermsOfServiceAndPrivacyPolicyResponseData>
    >("policy/term_content", {
      cancelToken: payload?.cancelToken,
    });
  },
  validatePhoneNumberExisted: (payload: ValidatePhoneNumberExistedPayload) => {
    return commonAxios.post<
      AxiosResponseData<ValidatePhoneNumberExistedResponseData>
    >("register/check_existed_phone", payload?.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  removeSearchHistory: (payload: RemoveSearchHistoryPayload) => {
    const { id } = payload.params;
    return authAxios.delete<AxiosResponseData>(
      `user/delete_history_search/${id}`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  clearSearchHistory: (payload?: ClearSearchHistoryPayload) => {
    return authAxios.delete<AxiosResponseData>(
      "user/delete_all_history_search",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  saveSubmittedSearchHistory: (payload: SaveSubmittedSearchHistoryPayload) => {
    return authAxios.post<AxiosResponseData>(
      "user/add_search_history",
      payload?.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  sendRegistrationEmailVerificationCode: (
    payload: SendRegistrationEmailVerificationCodePayload
  ) => {
    return commonAxios.post<AxiosResponseData>(
      "register/get_email_code",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  sendPasswordResetEmailVerificationCode: (
    payload: SendPasswordResetEmailVerificationCodePayload
  ) => {
    return commonAxios.post<AxiosResponseData>(
      "register/reset_pwd_email_code",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  sendBindEmailVerificationCode: (
    payload: SendBindEmailVerificationCodePayload
  ) => {
    return authAxios.post<AxiosResponseData>(
      "user/verify_email",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  recordPageAnalytics: (payload: RecordPageAnalyticsPayload) => {
    return authAxios.post<AxiosResponseData>(
      "analytics/write_log",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  uploadFile: (payload: UploadFilePayload) => {
    const formData = commonHelpers.formatFormData(payload.params);
    return authAxios.post<AxiosResponseData<string>>(
      "common/upload",
      formData,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  uploadVideoFile: (payload: UploadVideoFilePayload) => {
    const formData = commonHelpers.formatFormData(payload.params);
    return authAxios.post<
      AxiosResponseData<{ thumbnail_path: string; video_path: string }>
    >("common/upload_video", formData, {
      cancelToken: payload?.cancelToken,
    });
  },
  registerFirebaseNotificationDevice: (
    payload: RegisterFirebaseNotificationDevicePayload
  ) => {
    return authAxios.post<AxiosResponseData>(
      "notification/register_device",
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default commonApi;
