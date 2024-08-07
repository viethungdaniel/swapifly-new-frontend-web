import type {
  FetchProductConditionsPayload,
  FetchProductConditionsResponseData,
} from "@/utils/apis/productCondition";

export enum ProductConditionActionTypes {
  FETCH_REQUESTED = "@@productCondition/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@productCondition/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@productCondition/FETCH_FAILED",

  MAP_FETCH_REQUESTED = "@@productCondition/MAP_FETCH_REQUESTED",
  MAP_FETCH_SUCCEEDED = "@@productCondition/MAP_FETCH_SUCCEEDED",
  MAP_FETCH_FAILED = "@@productCondition/MAP_FETCH_FAILED",

  // Saga
  FETCH_PRODUCT_CONDITIONS_SAGA = "@@productCondition/FETCH_PRODUCT_CONDITIONS_SAGA",
}

// State

export interface ProductConditionState {
  productConditions: FetchProductConditionsResponseData;
  productConditionsLoading: boolean;
  productConditionsError: string;
}

// ---- Reducer Action ----

export type FetchScope = "productConditions";

export type FetchRequestedAction = {
  type: ProductConditionActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
  };
};

export type FetchSucceededAction = {
  type: ProductConditionActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: ProductConditionState[FetchScope];
    count?: number;
  };
};

export type FetchFailedAction = {
  type: ProductConditionActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

// ---- Saga Action ----

export type FetchProductConditionsSagaAction = {
  type: ProductConditionActionTypes.FETCH_PRODUCT_CONDITIONS_SAGA;
  payload?: FetchProductConditionsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type ProductConditionAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchProductConditionsSagaAction;
