import { authAxios } from "@/libs/axios";

import type {
  FetchUsersPayload,
  FetchUsersResponseData,
  FetchUserPayload,
  FetchUserResponseData,
  FollowUserPayload,
  ReportUserPayload,
  CheckUniqueUsernamePayload,
  FetchInboxThreadOfferProductAiChatUsersPayload,
  FetchInboxThreadOfferProductAiChatUsersResponseData,
} from "./user.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const userApi = {
  fetchUsers: (payload?: FetchUsersPayload) => {
    return authAxios.get<AxiosResponseData<FetchUsersResponseData>>(
      "user/index",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchInboxThreadOfferProductAiChatUsers: (
    payload?: FetchInboxThreadOfferProductAiChatUsersPayload
  ) => {
    return authAxios.get<
      AxiosResponseData<FetchInboxThreadOfferProductAiChatUsersResponseData>
    >("inbox/get_list_user_inbox_follow_product", {
      params: payload?.params,
      cancelToken: payload?.cancelToken,
    });
  },
  fetchUser: (payload: FetchUserPayload) => {
    const { id } = payload.params;
    return authAxios.get<AxiosResponseData<FetchUserResponseData>>(
      `user/profile_show/${id}`,
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  followUser: (payload: FollowUserPayload) => {
    return authAxios.post<AxiosResponseData>("user/follow", payload?.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  reportUser: (payload: ReportUserPayload) => {
    return authAxios.post<AxiosResponseData>(
      `user/report_user`,
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  checkUniqueUsername: (payload: CheckUniqueUsernamePayload) => {
    return authAxios.get<AxiosResponseData>(`user/is_username`, {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
};

export default userApi;
