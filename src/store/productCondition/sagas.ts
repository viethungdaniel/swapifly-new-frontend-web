import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { productConditionApi } from "@/utils/apis";

import { ProductConditionActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type { FetchScope, FetchProductConditionsSagaAction } from "./types";

function* fetchProductConditionsSaga(action: FetchProductConditionsSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "productConditions" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof productConditionApi.fetchProductConditions>> =
      yield call(productConditionApi.fetchProductConditions, {
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

function* productConditionSaga() {
  yield all([
    takeEvery(
      ProductConditionActionTypes.FETCH_PRODUCT_CONDITIONS_SAGA,
      fetchProductConditionsSaga
    ),
  ]);
}

export default productConditionSaga;
