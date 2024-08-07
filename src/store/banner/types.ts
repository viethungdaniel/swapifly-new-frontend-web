import type {
  FetchBannersPayload,
  FetchBannersResponseData,
} from "@/utils/apis/banner";

export enum BannerActionTypes {
  FETCH_REQUESTED = "@@banner/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@banner/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@banner/FETCH_FAILED",

  // Saga
  FETCH_BANNERS_SAGA = "@@banner/FETCH_BANNERS_SAGA",
}

// State

export interface BannerState {
  banners: FetchBannersResponseData["data"];
  bannersLoading: boolean;
  bannersError: string;
}

// ---- Reducer Action ----

export type FetchScope = "banners";

export type FetchRequestedAction = {
  type: BannerActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
  };
};

export type FetchSucceededAction = {
  type: BannerActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: BannerState[FetchScope];
    count?: number;
  };
};

export type FetchFailedAction = {
  type: BannerActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

// ---- Saga Action ----

export type FetchBannersSagaAction = {
  type: BannerActionTypes.FETCH_BANNERS_SAGA;
  payload?: FetchBannersPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type BannerAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchBannersSagaAction;
