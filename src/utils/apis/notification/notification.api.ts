import { authAxios } from "@/libs/axios";

import type {
  FetchNotificationsPayload,
  FetchNotificationsResponseData,
  FetchNotificationPayload,
  FetchNotificationResponseData,
  ReadNotificationPayload,
  ReadAllNotificationPayload,
  FetchUnreadNotificationCountPayload,
} from "./notification.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const notificationApi = {
  fetchNotifications: (payload?: FetchNotificationsPayload) => {
    return authAxios.get<AxiosResponseData<FetchNotificationsResponseData>>(
      "notification/index",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchUnreadNotificationCount: (
    payload?: FetchUnreadNotificationCountPayload
  ) => {
    return authAxios.get<AxiosResponseData<number>>(
      "notification/get_unread_count",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchNotification: (payload: FetchNotificationPayload) => {
    return authAxios.get<AxiosResponseData<FetchNotificationResponseData>>(
      `notification/show/${payload.params.id}`,
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  readNotification: (payload: ReadNotificationPayload) => {
    return authAxios.post<AxiosResponseData<{ unread_count: number }>>(
      `notification/read/${payload.params.id}`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  readAllNotification: (payload: ReadAllNotificationPayload) => {
    return authAxios.post<AxiosResponseData>("notification/read_all", {
      cancelToken: payload?.cancelToken,
    });
  },
};

export default notificationApi;
