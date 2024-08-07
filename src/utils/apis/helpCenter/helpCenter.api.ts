import { commonAxios } from "@/libs/axios";

import type {
  FetchHelpCentersPayload,
  FetchHelpCentersResponseData,
  FetchHelpCenterPayload,
  FetchHelpCenterResponseData,
  FetchHelpCentersItemPayload,
  FetchHelpCentersItemResponseData,
} from "./helpCenter.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const helpCenterApi = {
  fetchHelpCentersItem: (payload?: FetchHelpCentersItemPayload) => {
    return commonAxios.get<AxiosResponseData<FetchHelpCentersItemResponseData>>(
      "help-center/index",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchHelpCenters: (payload?: FetchHelpCentersPayload) => {
    return commonAxios.get<AxiosResponseData<FetchHelpCentersResponseData>>(
      "help-center/search",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchHelpCenter: (payload: FetchHelpCenterPayload) => {
    return commonAxios.get<AxiosResponseData<FetchHelpCenterResponseData>>(
      `help-center/show/${payload.params.id}`,
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
};

export default helpCenterApi;
