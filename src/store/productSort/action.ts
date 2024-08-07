import { ProductSortActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchProductSortsSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: ProductSortActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: ProductSortActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: ProductSortActionTypes.FETCH_FAILED,
  payload,
});

// ---- SAGA ACTION ----

export const fetchProductSortsSaga = (
  payload?: FetchProductSortsSagaAction["payload"],
  meta?: FetchProductSortsSagaAction["meta"]
): FetchProductSortsSagaAction => ({
  type: ProductSortActionTypes.FETCH_PRODUCT_SORTS_SAGA,
  payload,
  meta,
});
