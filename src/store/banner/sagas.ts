import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { bannerApi } from "@/utils/apis";

import { BannerActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type { FetchScope, FetchBannersSagaAction } from "./types";

function* fetchBannersSaga(action: FetchBannersSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "banners" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof bannerApi.fetchBanners>> = yield call(
      bannerApi.fetchBanners,
      {
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: (response.data.data ?? []).sort(
            (bannerA, bannerB) => bannerB.sort - bannerA.sort
          ),
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
  } catch (e) {
    if (axios.isCancel(e)) return;
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
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

function* bannerSaga() {
  yield all([
    takeEvery(BannerActionTypes.FETCH_BANNERS_SAGA, fetchBannersSaga),
  ]);
}

export default bannerSaga;
