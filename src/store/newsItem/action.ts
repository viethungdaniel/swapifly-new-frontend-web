import { NewsItemActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  FetchNewsItemSucceededServerAction,
  // Saga
  FetchRecentNewsItemsSagaAction,
  FetchNewsItemsSagaAction,
  FetchNewsItemSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: NewsItemActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: NewsItemActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: NewsItemActionTypes.FETCH_FAILED,
  payload,
});

export const fetchNewsItemSucceededServer = (
  payload: FetchNewsItemSucceededServerAction["payload"]
): FetchNewsItemSucceededServerAction => ({
  type: NewsItemActionTypes.FETCH_NEWS_ITEM_SUCCEEDED_SERVER,
  payload,
});

// ---- SAGA ACTION ----

export const fetchRecentNewsItemsSaga = (
  payload?: FetchRecentNewsItemsSagaAction["payload"],
  meta?: FetchRecentNewsItemsSagaAction["meta"]
): FetchRecentNewsItemsSagaAction => ({
  type: NewsItemActionTypes.FETCH_RECENT_NEWS_ITEMS_SAGA,
  payload,
  meta,
});

export const fetchNewsItemsSaga = (
  payload?: FetchNewsItemsSagaAction["payload"],
  meta?: FetchNewsItemsSagaAction["meta"]
): FetchNewsItemsSagaAction => ({
  type: NewsItemActionTypes.FETCH_NEWS_ITEMS_SAGA,
  payload,
  meta,
});

export const fetchNewsItemSaga = (
  payload: FetchNewsItemSagaAction["payload"],
  meta?: FetchNewsItemSagaAction["meta"]
): FetchNewsItemSagaAction => ({
  type: NewsItemActionTypes.FETCH_NEWS_ITEM_SAGA,
  payload,
  meta,
});
