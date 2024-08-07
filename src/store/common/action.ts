import { CommonActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  SetRegionAction,
  SetSearchAction,
  SetLocationAction,
  // Saga
  FetchCookieTokenSagaAction,
  FetchSettingsSagaAction,
  FetchRegionsSagaAction,
  FetchTermsOfServiceAndPrivacyPolicySagaAction,
} from "./types";

// ---- REDUCER ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: CommonActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: CommonActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: CommonActionTypes.FETCH_FAILED,
  payload,
});

export const setSearch = (
  payload: SetSearchAction["payload"]
): SetSearchAction => ({
  type: CommonActionTypes.SET_SEARCH,
  payload,
});

export const setRegion = (
  payload: SetRegionAction["payload"]
): SetRegionAction => ({
  type: CommonActionTypes.SET_REGION,
  payload,
});

export const setLocation = (
  payload: SetLocationAction["payload"]
): SetLocationAction => ({
  type: CommonActionTypes.SET_LOCATION,
  payload,
});

// ---- SAGA ----

export const fetchCookieTokenSaga = (
  payload?: FetchCookieTokenSagaAction["payload"],
  meta?: FetchCookieTokenSagaAction["meta"]
): FetchCookieTokenSagaAction => ({
  type: CommonActionTypes.FETCH_COOKIE_TOKEN_SAGA,
  payload,
  meta,
});

export const fetchSettingsSaga = (
  payload?: FetchSettingsSagaAction["payload"],
  meta?: FetchSettingsSagaAction["meta"]
): FetchSettingsSagaAction => ({
  type: CommonActionTypes.FETCH_SETTINGS_SAGA,
  payload,
  meta,
});

export const fetchRegionsSaga = (
  payload?: FetchRegionsSagaAction["payload"],
  meta?: FetchRegionsSagaAction["meta"]
): FetchRegionsSagaAction => ({
  type: CommonActionTypes.FETCH_REGIONS_SAGA,
  payload,
  meta,
});

export const fetchTermsOfServiceAndPrivacyPolicySaga = (
  payload?: FetchTermsOfServiceAndPrivacyPolicySagaAction["payload"],
  meta?: FetchTermsOfServiceAndPrivacyPolicySagaAction["meta"]
): FetchTermsOfServiceAndPrivacyPolicySagaAction => ({
  type: CommonActionTypes.FETCH_TERM_OF_SERVICE_AND_PRIVACY_POLICY_SAGA,
  payload,
  meta,
});
