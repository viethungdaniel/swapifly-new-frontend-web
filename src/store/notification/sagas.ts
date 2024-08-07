import { all, call, put, takeEvery, takeLatest } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { notificationApi } from "@/utils/apis";

import { NotificationActionTypes } from "./types";
import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
  setAllNotificationRead,
  setUnreadNotificationCountRead,
} from "./action";

import type {
  FetchScope,
  FetchNotificationsSagaAction,
  FetchNotificationSagaAction,
  ReadNotificationSagaAction,
  ReadAllNotificationSagaAction,
  FetchUnreadNotificationCountSagaAction,
} from "./types";

function* fetchNotificationsSaga(action: FetchNotificationsSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "notifications" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof notificationApi.fetchNotifications>> =
      yield call(notificationApi.fetchNotifications, {
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

function* fetchNotificationSaga(action: FetchNotificationSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};
  const scope = "notification" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof notificationApi.fetchNotification>> =
      yield call(notificationApi.fetchNotification, {
        params,
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

function* fetchUnreadNotificationCountSaga(
  action: FetchUnreadNotificationCountSagaAction
) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<
      ReturnType<typeof notificationApi.fetchUnreadNotificationCount>
    > = yield call(notificationApi.fetchUnreadNotificationCount, {
      cancelToken,
    });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(setUnreadNotificationCountRead(response.data));
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    resolve({ message });
  }
}

function* readNotificationSaga(action: ReadNotificationSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof notificationApi.readNotification>> =
      yield call(notificationApi.readNotification, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(setUnreadNotificationCountRead(response.data.unread_count));
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    resolve({ message });
  }
}

function* readAllNotificationSaga(action: ReadAllNotificationSagaAction) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof notificationApi.readAllNotification>> =
      yield call(notificationApi.readAllNotification, {
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setAllNotificationRead({
          read: 1 as const,
        })
      );
    }
    resolve(response);
  } catch (error) {
    if (axios.isCancel(error)) return;
    const message = axiosHelpers.getErrorMessage(error);
    resolve({ message });
  }
}

function* notificationSaga() {
  yield all([
    takeEvery(
      NotificationActionTypes.FETCH_NOTIFICATIONS_SAGA,
      fetchNotificationsSaga
    ),
    takeEvery(
      NotificationActionTypes.FETCH_NOTIFICATION_SAGA,
      fetchNotificationSaga
    ),
    takeLatest(
      NotificationActionTypes.FETCH_UNREAD_NOTIFICATION_COUNT_SAGA,
      fetchUnreadNotificationCountSaga
    ),
    takeLatest(
      NotificationActionTypes.READ_NOTIFICATION_SAGA,
      readNotificationSaga
    ),
    takeLatest(
      NotificationActionTypes.READ_ALL_NOTIFICATION_SAGA,
      readAllNotificationSaga
    ),
  ]);
}

export default notificationSaga;
