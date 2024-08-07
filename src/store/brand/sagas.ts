import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { brandApi } from "@/utils/apis";

import { BrandActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type { FetchScope, FetchBrandsSagaAction } from "./types";

function* fetchBrandsSaga(action: FetchBrandsSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "brands" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const { data: response }: Awaited<ReturnType<typeof brandApi.fetchBrands>> =
      yield call(brandApi.fetchBrands, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data.pagination.total,
          isLoadMore,
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

function* brandSaga() {
  yield all([takeEvery(BrandActionTypes.FETCH_BRANDS_SAGA, fetchBrandsSaga)]);
}

export default brandSaga;
