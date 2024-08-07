import { HYDRATE } from "next-redux-wrapper";

import { NotificationActionTypes } from "./types";

import { commonHelpers } from "@/utils/helpers";

import type { NotificationState, NotificationAction } from "./types";

export const initialState: NotificationState = {
  notifications: [],
  notificationsError: "",
  notificationsLoading: true,
  notificationsCount: 0,

  notification: null,
  notificationError: "",
  notificationLoading: true,

  unreadNotificationCount: 0,
};

const reducer = (
  state = initialState,
  action: NotificationAction
): NotificationState => {
  switch (action.type) {
    case HYDRATE as any: {
      const { notification, notificationError, notificationLoading, hydrated } =
        (action as any).payload.notification as NotificationState;

      const newState = {
        notification,
        notificationError,
        notificationLoading,
      };

      if (typeof hydrated !== "undefined") {
        Object.entries(newState).forEach(([key, _state]) => {
          if (typeof _state === "undefined") delete (newState as any)[key];
        });
      }

      return {
        ...state,
        ...(typeof hydrated !== "undefined" ? newState : {}),
        hydrated: true,
      };
    }

    case NotificationActionTypes.FETCH_REQUESTED: {
      const { scope, isReset } = action.payload;

      const newState = {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };

      if (isReset) {
        Object.assign(newState, {
          [scope]: Array.isArray(newState[scope]) ? [] : null,
        });
      }

      return newState;
    }
    case NotificationActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count, isLoadMore } = action.payload;

      let newData = data;
      const stateData = state[scope];

      if (isLoadMore && Array.isArray(stateData) && Array.isArray(data)) {
        const filteredData = data.filter((item) => {
          return stateData.every(
            (stateDataItem) => item.id !== stateDataItem.id
          );
        });
        newData = [...stateData, ...filteredData];
      }

      return {
        ...state,
        [scope]: newData,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: false,
            }
          : {}),
        ...(commonHelpers.isNumber(count)
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
    }
    case NotificationActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        [`${scope}Error`]: error,
        [`${scope}Loading`]: false,
      };
    }

    case NotificationActionTypes.FETCH_NOTIFICATION_SUCCEEDED_SERVER: {
      return {
        notification: action.payload,
        notificationError: "",
        notificationLoading: false,
        hydrated: true,
      } as Partial<NotificationState> as NotificationState;
    }

    case NotificationActionTypes.SET_ALL_NOTIFICATION_READ: {
      const { id, read } = action.payload;

      let newUnreadNotificationCount =
        typeof id === "undefined"
          ? 0
          : state.unreadNotificationCount + (read === 1 ? -1 : 1);
      newUnreadNotificationCount =
        newUnreadNotificationCount >= 0 ? newUnreadNotificationCount : 0;

      const newNotifications = state.notifications.map((notification) => {
        if (typeof id === "undefined")
          return {
            ...notification,
            is_read: read ? (1 as const) : (0 as const),
          };
        if (notification.id === id) {
          return {
            ...notification,
            is_read: read ? (1 as const) : (0 as const),
          };
        }
        return notification;
      });

      return {
        ...state,
        notifications: newNotifications,
        unreadNotificationCount: newUnreadNotificationCount,
      };
    }

    case NotificationActionTypes.SET_UNREAD_NOTIFICATION_COUNT: {
      return {
        ...state,
        unreadNotificationCount: action.payload,
      };
    }

    case NotificationActionTypes.INCREASE_UNREAD_NOTIFICATION_COUNT: {
      return {
        ...state,
        unreadNotificationCount: state.unreadNotificationCount + 1,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
