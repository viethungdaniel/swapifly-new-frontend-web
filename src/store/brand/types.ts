import type {
  FetchBrandsPayload,
  FetchBrandsResponseData,
} from "@/utils/apis/brand";

export enum BrandActionTypes {
  FETCH_REQUESTED = "@@brand/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@brand/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@brand/FETCH_FAILED",

  // Saga
  FETCH_BRANDS_SAGA = "@@brand/FETCH_BRANDS_SAGA",
}

// State

export interface BrandState {
  brands: FetchBrandsResponseData["data"];
  brandsLoading: boolean;
  brandsError: string;
  brandsCount: number;
}

// ---- Reducer Action ----

export type FetchScope = "brands";

export type FetchRequestedAction = {
  type: BrandActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: BrandActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: BrandState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: BrandActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

// ---- Saga Action ----

export type FetchBrandsSagaAction = {
  type: BrandActionTypes.FETCH_BRANDS_SAGA;
  payload?: FetchBrandsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isReset?: boolean;
    isLoadMore?: boolean;
  };
};

export type BrandAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchBrandsSagaAction;
