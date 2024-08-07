import { ReviewActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchReviewsSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: ReviewActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: ReviewActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: ReviewActionTypes.FETCH_FAILED,
  payload,
});

// Saga

export const fetchReviewsSaga = (
  payload: FetchReviewsSagaAction["payload"],
  meta?: FetchReviewsSagaAction["meta"]
): FetchReviewsSagaAction => ({
  type: ReviewActionTypes.FETCH_REVIEWS_SAGA,
  payload,
  meta,
});
