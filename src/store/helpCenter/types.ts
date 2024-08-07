import type {
  FetchHelpCenterPayload,
  FetchHelpCenterResponseData,
  FetchHelpCentersItemPayload,
  FetchHelpCentersItemResponseData,
  FetchHelpCentersPayload,
  FetchHelpCentersResponseData,
} from "@/utils/apis/helpCenter";

export enum HelpCenterActionTypes {
  FETCH_REQUESTED = "@@helpCenter/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@helpCenter/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@helpCenter/FETCH_FAILED",

  FETCH_HELP_CENTER_SUCCEEDED_SERVER = "@@helpCenter/FETCH_HELP_CENTER_SUCCEEDED_SERVER",

  // Saga
  FETCH_HELP_CENTERS_ITEM_SAGA = "@@helpCenter/FETCH_HELP_CENTERS_ITEM_SAGA",
  FETCH_HELP_CENTERS_SAGA = "@@helpCenter/FETCH_HELP_CENTERS_SAGA",
  FETCH_HELP_CENTER_SAGA = "@@helpCenter/FETCH_HELP_CENTER_SAGA",
}

// State

export interface HelpCenterState {
  hydrated?: boolean;

  helpCenters: FetchHelpCentersResponseData["data"];
  helpCentersLoading: boolean;
  helpCentersError: string;
  helpCentersCount: number;

  helpCentersItem: FetchHelpCentersItemResponseData | null;
  helpCentersItemLoading: boolean;
  helpCentersItemError: string;

  helpCenter: FetchHelpCenterResponseData | null;
  helpCenterLoading: boolean;
  helpCenterError: string;
}

// ---- Reducer Action ----

export type FetchScope = "helpCenters" | "helpCenter" | "helpCentersItem";

export type FetchRequestedAction = {
  type: HelpCenterActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: HelpCenterActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: HelpCenterState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: HelpCenterActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type FetchHelpCenterSucceededServerAction = {
  type: HelpCenterActionTypes.FETCH_HELP_CENTER_SUCCEEDED_SERVER;
  payload: FetchHelpCenterResponseData;
};

// ---- Saga Action ----

export type FetchHelpCentersItemSagaAction = {
  type: HelpCenterActionTypes.FETCH_HELP_CENTERS_ITEM_SAGA;
  payload?: FetchHelpCentersItemPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchHelpCentersSagaAction = {
  type: HelpCenterActionTypes.FETCH_HELP_CENTERS_SAGA;
  payload?: FetchHelpCentersPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isReset?: boolean;
    isLoadMore?: boolean;
  };
};

export type FetchHelpCenterSagaAction = {
  type: HelpCenterActionTypes.FETCH_HELP_CENTER_SAGA;
  payload: FetchHelpCenterPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type HelpCenterAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | FetchHelpCenterSucceededServerAction
  //
  | FetchHelpCentersItemSagaAction
  | FetchHelpCentersSagaAction
  | FetchHelpCenterSagaAction;
