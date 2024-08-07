import { all, call, put, select, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers, commonHelpers } from "@/utils/helpers";
import { commonApi } from "@/utils/apis";
import { appStorageService, storageService } from "@/services";
import { storageKeyConstants } from "@/utils/constants";

import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
  setRegion,
  setLocation,
} from "./action";
import { CommonActionTypes } from "./types";

import type {
  FetchSettingsSagaAction,
  FetchRegionsSagaAction,
  FetchScope,
  FetchCookieTokenSagaAction,
  FetchTermsOfServiceAndPrivacyPolicySagaAction,
} from "./types";
import type { FetchSettingsResponseData } from "@/utils/apis/common";
import type { AppState } from "@/store/rootReducer";

function* fetchSettingsSaga(action: FetchSettingsSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  const scope = "settings" as FetchScope;

  yield put(
    fetchRequested({
      scope,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof commonApi.fetchSettings>> = yield call(
      commonApi.fetchSettings,
      {
        cancelToken,
      }
    );

    if (axiosHelpers.checkRequestSuccess(response)) {
      const commonRegion: AppState["common"]["region"] = yield select(
        (state: AppState) => state.common.region
      );
      const settings = response.data as FetchSettingsResponseData;

      const cookieAuthUserRegionId =
        appStorageService.getCookieAuthUserRegionId();
      const storageDefaultAuthUserRegion =
        appStorageService.getStorageDefaultAuthUserRegion();
      if (
        storageDefaultAuthUserRegion?.id !== response.data.region?.id ||
        !cookieAuthUserRegionId ||
        !commonRegion
      ) {
        appStorageService.saveStorageAuthUserRegion(response.data.region);
        appStorageService.saveStorageDefaultAuthUserRegion(
          response.data.region
        );
        appStorageService.saveCookieAuthUserRegionId(response.data.region?.id);
        yield put(setRegion(response.data.region));
      }

      const location: AppState["common"]["location"] = yield select(
        (state: AppState) => state.common.location
      );

      if (commonHelpers.isSomeEmpty([location.latitude, location.longitude])) {
        appStorageService.saveCookieLocation({
          latitude: response.data.latitude,
          longitude: response.data.longitude,
        });
        yield put(
          setLocation({
            latitude: response.data.latitude,
            longitude: response.data.longitude,
          })
        );
      }

      yield put(
        fetchSucceeded({
          scope,
          data: {
            search_min_length: settings.search.min_length,
            search_history_max_records:
              settings.search.max_number_of_history_search,
            resend_email_code_time: settings.register.resend_email_code_time,
            reset_pwd_resend_email_code_time:
              settings.register.reset_pwd_resend_email_code_time,
            desktop_home_banner_resolution_width:
              settings.banner.desktop_home_banner_width,
            desktop_home_banner_resolution_height:
              settings.banner.desktop_home_banner_height,
            mobile_home_banner_resolution_width:
              settings.banner.mobile_home_banner_width,
            mobile_home_banner_resolution_height:
              settings.banner.mobile_home_banner_height,
          },
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axios.isAxiosError(error)
      ? (error.response?.data as any)?.message || error.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchRegionsSaga(action: FetchRegionsSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  const scope = "regions" as FetchScope;

  yield put(
    fetchRequested({
      scope,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof commonApi.fetchRegions>> = yield call(
      commonApi.fetchRegions,
      {
        cancelToken,
      }
    );

    if (axiosHelpers.checkRequestSuccess(response)) {
      const region: AppState["common"]["region"] = yield select(
        (state: AppState) => state.common.region
      );

      yield put(
        setRegion(
          !!region
            ? {
                ...region,
                ...response.data.find(
                  (_region: any) => _region.id === region?.id
                ),
              }
            : region
        )
      );
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axios.isAxiosError(error)
      ? (error.response?.data as any)?.message || error.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchCookieTokenSaga(action: FetchCookieTokenSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  const scope = "cookieToken" as FetchScope;

  const cookieToken = storageService.getCookieItem(
    storageKeyConstants.COOKIE_TOKEN
  );

  if (!!cookieToken) {
    yield put(
      fetchSucceeded({
        scope,
        data: cookieToken,
      })
    );
    resolve({ success: true });
    return;
  }

  yield put(
    fetchRequested({
      scope,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof commonApi.fetchCookieToken>> = yield call(
      commonApi.fetchCookieToken,
      {
        cancelToken,
      }
    );

    if (axiosHelpers.checkRequestSuccess(response)) {
      storageService.saveCookieItem(
        storageKeyConstants.COOKIE_TOKEN,
        response.data
      );
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error: any) {
    if (axios.isCancel(error)) return;
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchTermsOfServiceAndPrivacyPolicySaga(
  action: FetchTermsOfServiceAndPrivacyPolicySagaAction
) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  const scope = "termsOfServiceAndPrivacyPolicy" as FetchScope;

  yield put(
    fetchRequested({
      scope,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<
      ReturnType<typeof commonApi.fetchTermsOfServiceAndPrivacyPolicy>
    > = yield call(commonApi.fetchTermsOfServiceAndPrivacyPolicy, {
      cancelToken,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: {
            termsOfService: response.data?.term?.details ?? "",
            privacyPolicy: response.data?.policy?.details ?? "",
          },
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
        })
      );
    }
    resolve(response);
  } catch (error: any) {
    if (axios.isCancel(error)) return;
    const message = axios.isAxiosError(error)
      ? error.response?.data?.message || error.message
      : "";
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* commonSaga() {
  yield all([
    takeEvery(CommonActionTypes.FETCH_SETTINGS_SAGA, fetchSettingsSaga),
    takeEvery(CommonActionTypes.FETCH_REGIONS_SAGA, fetchRegionsSaga),
    takeEvery(CommonActionTypes.FETCH_COOKIE_TOKEN_SAGA, fetchCookieTokenSaga),
    takeEvery(
      CommonActionTypes.FETCH_TERM_OF_SERVICE_AND_PRIVACY_POLICY_SAGA,
      fetchTermsOfServiceAndPrivacyPolicySaga
    ),
  ]);
}

export default commonSaga;
