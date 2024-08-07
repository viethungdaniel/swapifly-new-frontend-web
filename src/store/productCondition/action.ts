import { ProductConditionActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchProductConditionsSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: ProductConditionActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: ProductConditionActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: ProductConditionActionTypes.FETCH_FAILED,
  payload,
});

// ---- SAGA ACTION ----

export const fetchProductConditionsSaga = (
  payload?: FetchProductConditionsSagaAction["payload"],
  meta?: FetchProductConditionsSagaAction["meta"]
): FetchProductConditionsSagaAction => ({
  type: ProductConditionActionTypes.FETCH_PRODUCT_CONDITIONS_SAGA,
  payload,
  meta,
});
