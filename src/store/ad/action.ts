import { AdActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchAdsSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: AdActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: AdActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: AdActionTypes.FETCH_FAILED,
  payload,
});

// ---- SAGA ACTION ----

export const fetchAdsSaga = (
  payload: FetchAdsSagaAction["payload"],
  meta?: FetchAdsSagaAction["meta"]
): FetchAdsSagaAction => ({
  type: AdActionTypes.FETCH_ADS_SAGA,
  payload,
  meta,
});
