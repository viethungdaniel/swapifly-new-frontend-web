import { BannerActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  // Saga
  FetchBannersSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: BannerActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: BannerActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: BannerActionTypes.FETCH_FAILED,
  payload,
});

// ---- SAGA ACTION ----

export const fetchBannersSaga = (
  payload?: FetchBannersSagaAction["payload"],
  meta?: FetchBannersSagaAction["meta"]
): FetchBannersSagaAction => ({
  type: BannerActionTypes.FETCH_BANNERS_SAGA,
  payload,
  meta,
});
