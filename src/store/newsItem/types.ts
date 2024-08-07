import type {
  FetchNewsItemPayload,
  FetchNewsItemResponseData,
  FetchNewsItemsPayload,
  FetchNewsItemsResponseData,
} from "@/utils/apis/newsItem";

export enum NewsItemActionTypes {
  FETCH_REQUESTED = "@@newsItem/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@newsItem/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@newsItem/FETCH_FAILED",

  FETCH_NEWS_ITEM_SUCCEEDED_SERVER = "@@newsItem/FETCH_NEWS_ITEM_SUCCEEDED_SERVER",

  // Saga
  FETCH_NEWS_ITEMS_SAGA = "@@newsItem/FETCH_NEWS_ITEMS_SAGA",
  FETCH_RECENT_NEWS_ITEMS_SAGA = "@@newsItem/FETCH_RECENT_NEWS_ITEMS_SAGA",
  FETCH_NEWS_ITEM_SAGA = "@@newsItem/FETCH_NEWS_ITEM_SAGA",
}

// State

export interface NewsItemState {
  hydrated?: boolean;

  newsItems: FetchNewsItemsResponseData["data"];
  newsItemsLoading: boolean;
  newsItemsError: string;
  newsItemsCount: number;

  recentNewsItems: FetchNewsItemsResponseData["data"];
  recentNewsItemsLoading: boolean;
  recentNewsItemsError: string;

  newsItem: FetchNewsItemResponseData | null;
  newsItemLoading: boolean;
  newsItemError: string;
}

// ---- Reducer Action ----

export type FetchScope = "newsItems" | "newsItem" | "recentNewsItems";

export type FetchRequestedAction = {
  type: NewsItemActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: NewsItemActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: NewsItemState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: NewsItemActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type FetchNewsItemSucceededServerAction = {
  type: NewsItemActionTypes.FETCH_NEWS_ITEM_SUCCEEDED_SERVER;
  payload: FetchNewsItemResponseData;
};

// ---- Saga Action ----

export type FetchNewsItemsSagaAction = {
  type: NewsItemActionTypes.FETCH_NEWS_ITEMS_SAGA;
  payload?: FetchNewsItemsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isReset?: boolean;
    isLoadMore?: boolean;
  };
};

export type FetchRecentNewsItemsSagaAction = {
  type: NewsItemActionTypes.FETCH_RECENT_NEWS_ITEMS_SAGA;
  payload?: FetchNewsItemsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isReset?: boolean;
    isLoadMore?: boolean;
  };
};

export type FetchNewsItemSagaAction = {
  type: NewsItemActionTypes.FETCH_NEWS_ITEM_SAGA;
  payload: FetchNewsItemPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type NewsItemAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | FetchNewsItemSucceededServerAction
  //
  | FetchRecentNewsItemsSagaAction
  | FetchNewsItemsSagaAction
  | FetchNewsItemSagaAction;
