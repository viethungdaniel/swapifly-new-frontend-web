import { NotificationActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  FetchNotificationSucceededServerAction,
  SetAllNotificationReadAction,
  SetUnreadNotificationCountAction,
  IncreaseUnreadNotificationCountAction,
  // Saga
  FetchNotificationsSagaAction,
  FetchNotificationSagaAction,
  FetchUnreadNotificationCountSagaAction,
  ReadAllNotificationSagaAction,
  ReadNotificationSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: NotificationActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: NotificationActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: NotificationActionTypes.FETCH_FAILED,
  payload,
});

export const fetchNotificationSucceededServer = (
  payload: FetchNotificationSucceededServerAction["payload"]
): FetchNotificationSucceededServerAction => ({
  type: NotificationActionTypes.FETCH_NOTIFICATION_SUCCEEDED_SERVER,
  payload,
});

export const setAllNotificationRead = (
  payload: SetAllNotificationReadAction["payload"]
): SetAllNotificationReadAction => ({
  type: NotificationActionTypes.SET_ALL_NOTIFICATION_READ,
  payload,
});

export const setUnreadNotificationCountRead = (
  payload: SetUnreadNotificationCountAction["payload"]
): SetUnreadNotificationCountAction => ({
  type: NotificationActionTypes.SET_UNREAD_NOTIFICATION_COUNT,
  payload,
});

export const increaseUnreadNotificationCountRead =
  (): IncreaseUnreadNotificationCountAction => ({
    type: NotificationActionTypes.INCREASE_UNREAD_NOTIFICATION_COUNT,
  });

// ---- SAGA ACTION ----

export const fetchNotificationsSaga = (
  payload?: FetchNotificationsSagaAction["payload"],
  meta?: FetchNotificationsSagaAction["meta"]
): FetchNotificationsSagaAction => ({
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_SAGA,
  payload,
  meta,
});

export const fetchNotificationSaga = (
  payload: FetchNotificationSagaAction["payload"],
  meta?: FetchNotificationSagaAction["meta"]
): FetchNotificationSagaAction => ({
  type: NotificationActionTypes.FETCH_NOTIFICATION_SAGA,
  payload,
  meta,
});

export const fetchUnreadNotificationSaga = (
  payload?: FetchUnreadNotificationCountSagaAction["payload"],
  meta?: FetchUnreadNotificationCountSagaAction["meta"]
): FetchUnreadNotificationCountSagaAction => ({
  type: NotificationActionTypes.FETCH_UNREAD_NOTIFICATION_COUNT_SAGA,
  payload,
  meta,
});

export const readNotificationSaga = (
  payload: ReadNotificationSagaAction["payload"],
  meta?: ReadNotificationSagaAction["meta"]
): ReadNotificationSagaAction => ({
  type: NotificationActionTypes.READ_NOTIFICATION_SAGA,
  payload,
  meta,
});

export const readAllNotificationSaga = (
  payload: ReadAllNotificationSagaAction["payload"],
  meta?: ReadAllNotificationSagaAction["meta"]
): ReadAllNotificationSagaAction => ({
  type: NotificationActionTypes.READ_ALL_NOTIFICATION_SAGA,
  payload,
  meta,
});
