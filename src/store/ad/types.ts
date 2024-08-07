import type { FetchAdsPayload, FetchAdsResponseData } from "@/utils/apis/ad";

export enum AdActionTypes {
  FETCH_REQUESTED = "@@ad/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@ad/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@ad/FETCH_FAILED",

  // Saga
  FETCH_ADS_SAGA = "@@ad/FETCH_ADS_SAGA",
}

// State

export interface AdState {
  bannersAds: FetchAdsResponseData;
  bannersAdsLoading: boolean;
  bannersAdsError: string;

  popupAd: FetchAdsResponseData[number] | null;
  popupAdLoading: boolean;
  popupAdError: string;

  productsRectangleAds: FetchAdsResponseData;
  productsRectangleAdsLoading: boolean;
  productsRectangleAdsError: string;

  productsSquareAds: FetchAdsResponseData;
  productsSquareAdsLoading: boolean;
  productsSquareAdsError: string;

  recommendedHomeProductsSquareAds: FetchAdsResponseData;
  recommendedHomeProductsSquareAdsLoading: boolean;
  recommendedHomeProductsSquareAdsError: string;

  productAd: FetchAdsResponseData[number] | null;
  productAdLoading: boolean;
  productAdError: string;

  inboxThreadsAds: FetchAdsResponseData;
  inboxThreadsAdsLoading: boolean;
  inboxThreadsAdsError: string;
}

// ---- Reducer Action ----

type FetchAdsScope =
  | "bannersAds"
  | "popupAd"
  | "productsRectangleAds"
  | "productsSquareAds"
  | "recommendedHomeProductsSquareAds"
  | "productAd"
  | "inboxThreadsAds";

export type FetchScope = FetchAdsScope;

export type FetchRequestedAction = {
  type: AdActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
    loadingDisabled?: boolean;
    params?: any;
  };
};

export type FetchSucceededAction = {
  type: AdActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: AdState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
    params?: any;
  };
};

export type FetchFailedAction = {
  type: AdActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
    params?: any;
  };
};

// ---- Saga Action ----

export type FetchAdsSagaAction = {
  type: AdActionTypes.FETCH_ADS_SAGA;
  payload: Omit<FetchAdsPayload, "params"> & {
    params: {
      scopes: Array<FetchAdsScope>;
    };
  };
  meta?: {
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type AdAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchAdsSagaAction;
