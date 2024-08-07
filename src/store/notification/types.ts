import type {
  FetchNotificationPayload,
  FetchNotificationResponseData,
  FetchNotificationsPayload,
  FetchNotificationsResponseData,
  FetchUnreadNotificationCountPayload,
  ReadAllNotificationPayload,
  ReadNotificationPayload,
} from "@/utils/apis/notification";

export enum NotificationActionTypes {
  FETCH_REQUESTED = "@@notification/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@notification/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@notification/FETCH_FAILED",

  FETCH_NOTIFICATION_SUCCEEDED_SERVER = "@@notification/FETCH_NOTIFICATION_SUCCEEDED_SERVER",

  SET_ALL_NOTIFICATION_READ = "@@notification/SET_ALL_NOTIFICATION_READ",
  SET_UNREAD_NOTIFICATION_COUNT = "@@notification/SET_UNREAD_NOTIFICATION_COUNT",
  INCREASE_UNREAD_NOTIFICATION_COUNT = "@@notification/INCREASE_UNREAD_NOTIFICATION_COUNT",

  // Saga
  READ_NOTIFICATION_SAGA = "@@notification/READ_NOTIFICATION_SAGA",
  READ_ALL_NOTIFICATION_SAGA = "@@notification/READ_ALL_NOTIFICATION_SAGA",
  FETCH_NOTIFICATIONS_SAGA = "@@notification/FETCH_NOTIFICATIONS_SAGA",
  FETCH_NOTIFICATION_SAGA = "@@notification/FETCH_NOTIFICATION_SAGA",
  FETCH_UNREAD_NOTIFICATION_COUNT_SAGA = "@@notification/FETCH_UNREAD_NOTIFICATION_COUNT_SAGA",
}

// State

export interface NotificationState {
  hydrated?: boolean;

  notifications: FetchNotificationsResponseData["data"];
  notificationsLoading: boolean;
  notificationsError: string;
  notificationsCount: number;

  notification: FetchNotificationResponseData | null;
  notificationLoading: boolean;
  notificationError: string;

  unreadNotificationCount: number;
}

// ---- Reducer Action ----

export type FetchScope = "notifications" | "notification";

export type FetchRequestedAction = {
  type: NotificationActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: NotificationActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: NotificationState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: NotificationActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type FetchNotificationSucceededServerAction = {
  type: NotificationActionTypes.FETCH_NOTIFICATION_SUCCEEDED_SERVER;
  payload: FetchNotificationResponseData;
};

export type SetAllNotificationReadAction = {
  type: NotificationActionTypes.SET_ALL_NOTIFICATION_READ;
  payload: {
    id?: number;
    read: BooleanNumber;
  };
};

export type SetUnreadNotificationCountAction = {
  type: NotificationActionTypes.SET_UNREAD_NOTIFICATION_COUNT;
  payload: number;
};

export type IncreaseUnreadNotificationCountAction = {
  type: NotificationActionTypes.INCREASE_UNREAD_NOTIFICATION_COUNT;
};

// ---- Saga Action ----

export type FetchNotificationsSagaAction = {
  type: NotificationActionTypes.FETCH_NOTIFICATIONS_SAGA;
  payload?: FetchNotificationsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isReset?: boolean;
    isLoadMore?: boolean;
  };
};

export type FetchNotificationSagaAction = {
  type: NotificationActionTypes.FETCH_NOTIFICATION_SAGA;
  payload: FetchNotificationPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isReset?: boolean;
    isLoadMore?: boolean;
  };
};

export type ReadNotificationSagaAction = {
  type: NotificationActionTypes.READ_NOTIFICATION_SAGA;
  payload: ReadNotificationPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type ReadAllNotificationSagaAction = {
  type: NotificationActionTypes.READ_ALL_NOTIFICATION_SAGA;
  payload?: ReadAllNotificationPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchUnreadNotificationCountSagaAction = {
  type: NotificationActionTypes.FETCH_UNREAD_NOTIFICATION_COUNT_SAGA;
  payload?: FetchUnreadNotificationCountPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type NotificationAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | FetchNotificationSucceededServerAction
  | SetAllNotificationReadAction
  | SetUnreadNotificationCountAction
  | IncreaseUnreadNotificationCountAction
  //
  | FetchNotificationsSagaAction
  | ReadNotificationSagaAction
  | FetchNotificationSagaAction
  | FetchUnreadNotificationCountSagaAction
  | ReadAllNotificationSagaAction;
