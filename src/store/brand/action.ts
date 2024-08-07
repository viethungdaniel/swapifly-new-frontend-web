import { BrandActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchBrandsSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: BrandActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: BrandActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: BrandActionTypes.FETCH_FAILED,
  payload,
});

// ---- SAGA ACTION ----

export const fetchBrandsSaga = (
  payload?: FetchBrandsSagaAction["payload"],
  meta?: FetchBrandsSagaAction["meta"]
): FetchBrandsSagaAction => ({
  type: BrandActionTypes.FETCH_BRANDS_SAGA,
  payload,
  meta,
});
