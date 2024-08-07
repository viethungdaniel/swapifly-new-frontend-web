import type {
  FetchProductSortsPayload,
  FetchProductSortsResponseData,
} from "@/utils/apis/productSort";

export enum ProductSortActionTypes {
  FETCH_REQUESTED = "@@productSort/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@productSort/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@productSort/FETCH_FAILED",

  MAP_FETCH_REQUESTED = "@@productSort/MAP_FETCH_REQUESTED",
  MAP_FETCH_SUCCEEDED = "@@productSort/MAP_FETCH_SUCCEEDED",
  MAP_FETCH_FAILED = "@@productSort/MAP_FETCH_FAILED",

  // Saga
  FETCH_PRODUCT_SORTS_SAGA = "@@productSort/FETCH_PRODUCT_SORTS_SAGA",
}

// State

export interface ProductSortState {
  productSorts: FetchProductSortsResponseData;
  productSortsLoading: boolean;
  productSortsError: string;
}

// ---- Reducer Action ----

export type FetchScope = "productSorts";

export type FetchRequestedAction = {
  type: ProductSortActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
  };
};

export type FetchSucceededAction = {
  type: ProductSortActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: ProductSortState[FetchScope];
    count?: number;
  };
};

export type FetchFailedAction = {
  type: ProductSortActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

// ---- Saga Action ----

export type FetchProductSortsSagaAction = {
  type: ProductSortActionTypes.FETCH_PRODUCT_SORTS_SAGA;
  payload?: FetchProductSortsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type ProductSortAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchProductSortsSagaAction;
