import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { productSortApi } from "@/utils/apis";

import { ProductSortActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type { FetchScope, FetchProductSortsSagaAction } from "./types";

function* fetchProductSortsSaga(action: FetchProductSortsSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "productSorts" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productSortApi.fetchProductSorts>> =
      yield call(productSortApi.fetchProductSorts, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data ?? [],
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

function* productSortSaga() {
  yield all([
    takeEvery(
      ProductSortActionTypes.FETCH_PRODUCT_SORTS_SAGA,
      fetchProductSortsSaga
    ),
  ]);
}

export default productSortSaga;
