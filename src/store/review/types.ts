import type {
  FetchReviewsPayload,
  FetchReviewsResponseData,
} from "@/utils/apis/review";

export enum ReviewActionTypes {
  FETCH_REQUESTED = "@@review/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@review/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@review/FETCH_FAILED",

  // Saga
  FETCH_REVIEWS_SAGA = "@@review/FETCH_REVIEWS_SAGA",
}

// State

export interface ReviewState {
  reviews: FetchReviewsResponseData["data"];
  reviewsLoading: boolean;
  reviewsError: string;
  reviewsCount: number;
}

// ---- Reducer Action ----

export type FetchScope = "reviews";

export type FetchRequestedAction = {
  type: ReviewActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: ReviewActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: ReviewState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: ReviewActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

// ---- Saga Action ----

export type FetchReviewsSagaAction = {
  type: ReviewActionTypes.FETCH_REVIEWS_SAGA;
  payload: FetchReviewsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type ReviewAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchReviewsSagaAction;
