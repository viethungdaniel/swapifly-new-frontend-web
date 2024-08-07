import { authAxios } from "@/libs/axios";

import type {
  FetchInboxThreadsPayload,
  FetchInboxThreadsResponseData,
  FetchInboxThreadMessagesPayload,
  FetchInboxThreadMessagesResponseData,
  FetchInboxThreadOfferPayload,
  FetchInboxThreadOfferResponseData,
  DeleteInboxThreadsPayload,
  SaveInboxThreadArchivedStatePayload,
  FetchUnreadInboxThreadMessageCountPayload,
  UpdateInboxThreadAiChatStatusPayload,
} from "./inbox.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const inboxApi = {
  fetchUnreadInboxThreadMessageCount: (
    payload?: FetchUnreadInboxThreadMessageCountPayload
  ) => {
    return authAxios.get<AxiosResponseData<number>>(
      "inbox/get_total_unread_message",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchInboxThreads: (payload: FetchInboxThreadsPayload) => {
    return authAxios.get<AxiosResponseData<FetchInboxThreadsResponseData>>(
      "inbox/index",
      {
        params: payload.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchInboxThreadMessages: (payload: FetchInboxThreadMessagesPayload) => {
    const { inbox_thread_id } = payload.params;
    return authAxios.get<
      AxiosResponseData<FetchInboxThreadMessagesResponseData>
    >(`inbox/details/${inbox_thread_id}`, {
      cancelToken: payload?.cancelToken,
    });
  },
  fetchInboxThreadOffer: (payload: FetchInboxThreadOfferPayload) => {
    const { inbox_thread_id } = payload.params;
    return authAxios.get<AxiosResponseData<FetchInboxThreadOfferResponseData>>(
      `inbox/thread_offer/${inbox_thread_id}`,
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  deleteInboxThreads: (payload: DeleteInboxThreadsPayload) => {
    return authAxios.delete<AxiosResponseData>(`inbox/delete`, {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
  saveInboxThreadArchivedState: (
    payload: SaveInboxThreadArchivedStatePayload
  ) => {
    return authAxios.post<AxiosResponseData>(`inbox/archive`, payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  updateInboxThreadAiChatStatus: (
    payload?: UpdateInboxThreadAiChatStatusPayload
  ) => {
    return authAxios.patch<AxiosResponseData>(
      "inbox/switch_users_inbox_follow_product",
      payload?.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default inboxApi;
