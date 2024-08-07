import { HelpCenterActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  FetchHelpCenterSucceededServerAction,
  // Saga
  FetchHelpCentersItemSagaAction,
  FetchHelpCentersSagaAction,
  FetchHelpCenterSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: HelpCenterActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: HelpCenterActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: HelpCenterActionTypes.FETCH_FAILED,
  payload,
});

export const fetchHelpCenterSucceededServer = (
  payload: FetchHelpCenterSucceededServerAction["payload"]
): FetchHelpCenterSucceededServerAction => ({
  type: HelpCenterActionTypes.FETCH_HELP_CENTER_SUCCEEDED_SERVER,
  payload,
});

// ---- SAGA ACTION ----

export const fetchHelpCentersItemSaga = (
  payload?: FetchHelpCentersItemSagaAction["payload"],
  meta?: FetchHelpCentersItemSagaAction["meta"]
): FetchHelpCentersItemSagaAction => ({
  type: HelpCenterActionTypes.FETCH_HELP_CENTERS_ITEM_SAGA,
  payload,
  meta,
});

export const fetchHelpCentersSaga = (
  payload?: FetchHelpCentersSagaAction["payload"],
  meta?: FetchHelpCentersSagaAction["meta"]
): FetchHelpCentersSagaAction => ({
  type: HelpCenterActionTypes.FETCH_HELP_CENTERS_SAGA,
  payload,
  meta,
});

export const fetchHelpCenterSaga = (
  payload: FetchHelpCenterSagaAction["payload"],
  meta?: FetchHelpCenterSagaAction["meta"]
): FetchHelpCenterSagaAction => ({
  type: HelpCenterActionTypes.FETCH_HELP_CENTER_SAGA,
  payload,
  meta,
});
