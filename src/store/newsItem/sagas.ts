import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { newsItemApi } from "@/utils/apis";

import { NewsItemActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type {
  FetchScope,
  FetchNewsItemsSagaAction,
  FetchNewsItemSagaAction,
  FetchRecentNewsItemsSagaAction,
} from "./types";

function* fetchRecentNewsItemsSaga(action: FetchRecentNewsItemsSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "recentNewsItems" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof newsItemApi.fetchNewsItems>> = yield call(
      newsItemApi.fetchNewsItems,
      {
        params: {
          limit: 3,
          page: 1,
          ignored_news_id: params?.ignored_news_id,
        },
        cancelToken,
      }
    );
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
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchNewsItemsSaga(action: FetchNewsItemsSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "newsItems" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof newsItemApi.fetchNewsItems>> = yield call(
      newsItemApi.fetchNewsItems,
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
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* fetchNewsItemSaga(action: FetchNewsItemSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};
  const scope = "newsItem" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof newsItemApi.fetchNewsItem>> = yield call(
      newsItemApi.fetchNewsItem,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
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
    const message = axiosHelpers.getErrorMessage(error);
    yield put(
      fetchFailed({
        scope,
        error: message,
      })
    );
    resolve({ message });
  }
}

function* newsItemSaga() {
  yield all([
    takeEvery(NewsItemActionTypes.FETCH_NEWS_ITEMS_SAGA, fetchNewsItemsSaga),
    takeEvery(
      NewsItemActionTypes.FETCH_RECENT_NEWS_ITEMS_SAGA,
      fetchRecentNewsItemsSaga
    ),
    takeEvery(NewsItemActionTypes.FETCH_NEWS_ITEM_SAGA, fetchNewsItemSaga),
  ]);
}

export default newsItemSaga;
