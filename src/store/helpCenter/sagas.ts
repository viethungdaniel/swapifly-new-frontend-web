import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { helpCenterApi } from "@/utils/apis";

import { HelpCenterActionTypes } from "./types";
import { fetchRequested, fetchSucceeded, fetchFailed } from "./action";

import type {
  FetchScope,
  FetchHelpCentersSagaAction,
  FetchHelpCenterSagaAction,
} from "./types";

function* fetchHelpCentersSaga(action: FetchHelpCentersSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "helpCenters" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof helpCenterApi.fetchHelpCenters>> = yield call(
      helpCenterApi.fetchHelpCenters,
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

function* fetchHelpCentersItemSaga(action: FetchHelpCenterSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "helpCentersItem" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof helpCenterApi.fetchHelpCentersItem>> =
      yield call(helpCenterApi.fetchHelpCentersItem, {
        cancelToken,
      });
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

function* fetchHelpCenterSaga(action: FetchHelpCenterSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};
  const scope = "helpCenter" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof helpCenterApi.fetchHelpCenter>> = yield call(
      helpCenterApi.fetchHelpCenter,
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

function* helpCenterSaga() {
  yield all([
    takeEvery(
      HelpCenterActionTypes.FETCH_HELP_CENTERS_ITEM_SAGA,
      fetchHelpCentersItemSaga
    ),
    takeEvery(
      HelpCenterActionTypes.FETCH_HELP_CENTERS_SAGA,
      fetchHelpCentersSaga
    ),
    takeEvery(
      HelpCenterActionTypes.FETCH_HELP_CENTER_SAGA,
      fetchHelpCenterSaga
    ),
  ]);
}

export default helpCenterSaga;
