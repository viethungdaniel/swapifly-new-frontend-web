import { UserActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  SetAllUserFollowAction,
  SetAllUserBannerAction,
  FetchUserSucceededServerAction,
  // Saga
  FetchUsersSagaAction,
  FetchUserSagaAction,
  FollowUserSagaAction,
  FetchInboxThreadOfferProductAiChatUsersSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: UserActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: UserActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: UserActionTypes.FETCH_FAILED,
  payload,
});

export const fetchUserSucceededServer = (
  payload: FetchUserSucceededServerAction["payload"]
): FetchUserSucceededServerAction => ({
  type: UserActionTypes.FETCH_USER_SUCCEEDED_SERVER,
  payload,
});

export const setAllUserFollow = (
  payload: SetAllUserFollowAction["payload"]
): SetAllUserFollowAction => ({
  type: UserActionTypes.SET_ALL_USER_FOLLOW,
  payload,
});

export const setAllUserBanner = (
  payload: SetAllUserBannerAction["payload"]
): SetAllUserBannerAction => ({
  type: UserActionTypes.SET_ALL_USER_BANNER,
  payload,
});

// ---- SAGA ACTION ----

export const fetchUsersSaga = (
  payload?: FetchUsersSagaAction["payload"],
  meta?: FetchUsersSagaAction["meta"]
): FetchUsersSagaAction => ({
  type: UserActionTypes.FETCH_USERS_SAGA,
  payload,
  meta,
});

export const fetchUserSaga = (
  payload: FetchUserSagaAction["payload"],
  meta?: FetchUserSagaAction["meta"]
): FetchUserSagaAction => ({
  type: UserActionTypes.FETCH_USER_SAGA,
  payload,
  meta,
});

export const followUserSaga = (
  payload: FollowUserSagaAction["payload"],
  meta?: FollowUserSagaAction["meta"]
): FollowUserSagaAction => ({
  type: UserActionTypes.FOLLOW_USER_SAGA,
  payload,
  meta,
});

export const fetchInboxThreadOfferProductAiChatUsersSaga = (
  payload: FetchInboxThreadOfferProductAiChatUsersSagaAction["payload"],
  meta?: FetchInboxThreadOfferProductAiChatUsersSagaAction["meta"]
): FetchInboxThreadOfferProductAiChatUsersSagaAction => ({
  type: UserActionTypes.FETCH_INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_SAGA,
  payload,
  meta,
});
