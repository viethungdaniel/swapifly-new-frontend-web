import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { reviewApi } from "@/utils/apis";

import { ReviewActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type { FetchScope, FetchReviewsSagaAction } from "./types";

function* fetchReviewsSaga(action: FetchReviewsSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "reviews" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof reviewApi.fetchReviews>> = yield call(
      reviewApi.fetchReviews,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data?.pagination?.total ?? 0,
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

function* reviewSaga() {
  yield all([
    takeEvery(ReviewActionTypes.FETCH_REVIEWS_SAGA, fetchReviewsSaga),
  ]);
}

export default reviewSaga;
