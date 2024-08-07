import { ProductCategoryActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchProductCategoriesSagaAction,
} from "./types";

// ---- REDUCER ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: ProductCategoryActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: ProductCategoryActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: ProductCategoryActionTypes.FETCH_FAILED,
  payload,
});

// ---- SAGA ----

export const fetchProductCategoriesSaga = (
  payload?: FetchProductCategoriesSagaAction["payload"],
  meta?: FetchProductCategoriesSagaAction["meta"]
): FetchProductCategoriesSagaAction => ({
  type: ProductCategoryActionTypes.FETCH_PRODUCT_CATEGORIES_SAGA,
  payload,
  meta,
});
