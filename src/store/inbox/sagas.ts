import { all, call, put, takeEvery } from "redux-saga/effects";
import axios from "axios";

import { axiosHelpers } from "@/utils/helpers";
import { inboxApi } from "@/utils/apis";

import { InboxActionTypes } from "./types";
import {
  fetchRequested,
  fetchSucceeded,
  fetchFailed,
  updateInboxThreadAiChatStatusSucceeded,
} from "./action";

import type {
  FetchScope,
  FetchInboxThreadsSagaAction,
  FetchInboxThreadMessagesSagaAction,
  FetchInboxThreadOfferSagaAction,
  FetchUnreadInboxThreadMessageCountSagaAction,
  UpdateInboxThreadAiChatStatusSaga,
} from "./types";
import { inboxConstants } from "@/utils/constants";

function* fetchInboxThreadsSaga(action: FetchInboxThreadsSagaAction) {
  const { params, cancelToken } = action.payload;
  const {
    resolve = () => {},
    isLoadMore,
    isReset,
    loadingDisabled,
  } = action.meta || {};
  const scope = "inboxThreads" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
      loadingDisabled,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof inboxApi.fetchInboxThreads>> = yield call(
      inboxApi.fetchInboxThreads,
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
          count: response.data?.length ?? 0,
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

function* fetchInboxThreadMessagesSaga(
  action: FetchInboxThreadMessagesSagaAction
) {
  const { params, cancelToken } = action.payload;
  const {
    resolve = () => {},
    isLoadMore,
    isReset,
    loadingDisabled,
    params: metaParams,
  } = action.meta || {};
  const scope = "inboxThreadMessages" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      isReset,
      loadingDisabled,
      params: metaParams,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof inboxApi.fetchInboxThreadMessages>> =
      yield call(inboxApi.fetchInboxThreadMessages, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: response.data,
          count: response.data?.length ?? 0,
          isLoadMore,
          params: metaParams,
        })
      );
    } else {
      yield put(
        fetchFailed({
          scope,
          error: response.message,
          params: metaParams,
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
        params: metaParams,
      })
    );
    resolve({ message });
  }
}

function* fetchInboxThreadOfferSaga(action: FetchInboxThreadOfferSagaAction) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {}, loadingDisabled } = action.meta || {};
  const scope = "inboxThreadOffer" as FetchScope;
  yield put(
    fetchRequested({
      scope,
      loadingDisabled,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof inboxApi.fetchInboxThreadOffer>> = yield call(
      inboxApi.fetchInboxThreadOffer,
      {
        params,
        cancelToken,
      }
    );
    if (axiosHelpers.checkRequestSuccess(response)) {
      yield put(
        fetchSucceeded({
          scope,
          data: {
            ...response.data,
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

function* fetchUnreadInboxThreadMessageCountSaga(
  action: FetchUnreadInboxThreadMessageCountSagaAction
) {
  const { cancelToken } = action.payload || {};
  const { resolve = () => {} } = action.meta || {};
  const scope = "unreadInboxThreadMessageCount" as FetchScope;
  yield put(
    fetchRequested({
      scope,
    })
  );
  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof inboxApi.fetchUnreadInboxThreadMessageCount>> =
      yield call(inboxApi.fetchUnreadInboxThreadMessageCount, {
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

function* updateInboxThreadAiChatStatusSaga(
  action: UpdateInboxThreadAiChatStatusSaga
) {
  const { params, cancelToken } = action.payload;
  const { resolve = () => {} } = action.meta || {};

  try {
    const {
      data: response,
    }: Awaited<ReturnType<typeof inboxApi.updateInboxThreadAiChatStatus>> =
      yield call(inboxApi.updateInboxThreadAiChatStatus, {
        params,
        cancelToken,
      });
    if (axiosHelpers.checkRequestSuccess(response)) {
      if (params.type === inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE)
        yield put(
          updateInboxThreadAiChatStatusSucceeded({
            product_id: params.product_id,
            status: params.type,
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

function* inboxSaga() {
  yield all([
    takeEvery(InboxActionTypes.FETCH_INBOX_THREADS_SAGA, fetchInboxThreadsSaga),
    takeEvery(
      InboxActionTypes.FETCH_INBOX_THREAD_MESSAGES_SAGA,
      fetchInboxThreadMessagesSaga
    ),
    takeEvery(
      InboxActionTypes.FETCH_INBOX_THREAD_OFFER_SAGA,
      fetchInboxThreadOfferSaga
    ),
    takeEvery(
      InboxActionTypes.FETCH_UNREAD_INBOX_THREAD_MESSAGE_COUNT_SAGA,
      fetchUnreadInboxThreadMessageCountSaga
    ),
    takeEvery(
      InboxActionTypes.UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SAGA,
      updateInboxThreadAiChatStatusSaga
    ),
  ]);
}

export default inboxSaga;
