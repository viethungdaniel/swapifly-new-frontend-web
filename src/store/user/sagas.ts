import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { userApi } from "@/utils/apis";
import { userConstants } from "@/utils/constants";

import { UserActionTypes } from "./types";
import {
  fetchRequested,
  fetchFailed,
  fetchSucceeded,
  setAllUserFollow,
} from "./action";

import type {
  FetchInboxThreadOfferProductAiChatUsersSagaAction,
  FetchScope,
  FetchUserSagaAction,
  FetchUsersSagaAction,
  FollowUserSagaAction,
} from "./types";

function* fetchUsersSaga(action: FetchUsersSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "users" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );
  try {
    const { data: response }: Awaited<ReturnType<typeof userApi.fetchUsers>> =
      yield call(userApi.fetchUsers, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data.pagination.total,
          isLoadMore: !!isLoadMore,
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

function* fetchInboxThreadOfferProductAiChatUsersSaga(
  action: FetchInboxThreadOfferProductAiChatUsersSagaAction
) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {}, isLoadMore, isReset } = action.meta || {};
  const scope = "inboxThreadOfferProductAiChatUsers" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<
      ReturnType<typeof userApi.fetchInboxThreadOfferProductAiChatUsers>
    > = yield call(userApi.fetchInboxThreadOfferProductAiChatUsers, {
      params,
      cancelToken,
    });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data.data ?? [],
          count: response.data.pagination.total,
          isLoadMore: !!isLoadMore,
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

function* fetchUserSaga(action: FetchUserSagaAction) {
  const { params, cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "user" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const { data: response }: Awaited<ReturnType<typeof userApi.fetchUser>> =
      yield call(userApi.fetchUser, {
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

function* followUserSaga(action: FollowUserSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  const followed = params.state === userConstants.FOLLOW_ID;

  yield put(
    setAllUserFollow({
      id: params.user_id,
      followed,
    })
  );

  try {
    const { data: response }: Awaited<ReturnType<typeof userApi.followUser>> =
      yield call(userApi.followUser, {
        params,
        cancelToken,
      });
    if (!axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        setAllUserFollow({
          id: params.user_id,
          followed: !followed,
        })
      );
    }
    resolve(response);
  } catch (e) {
    if (axios.isCancel(e)) return;
    yield put(
      setAllUserFollow({
        id: params.user_id,
        followed,
      })
    );
    const message = axios.isAxiosError(e)
      ? (e.response?.data as any)?.message || e.message
      : "";
    resolve({ message });
  }
}

function* userSaga() {
  yield all([
    takeEvery(UserActionTypes.FETCH_USERS_SAGA, fetchUsersSaga),
    takeEvery(
      UserActionTypes.FETCH_INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_SAGA,
      fetchInboxThreadOfferProductAiChatUsersSaga
    ),
    takeEvery(UserActionTypes.FETCH_USER_SAGA, fetchUserSaga),
    takeEvery(UserActionTypes.FOLLOW_USER_SAGA, followUserSaga),
  ]);
}

export default userSaga;
