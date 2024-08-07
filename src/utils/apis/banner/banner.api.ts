import { commonAxios } from "@/libs/axios";

import type {
  FetchBannersPayload,
  FetchBannersResponseData,
} from "./banner.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const bannerApi = {
  fetchBanners: (payload?: FetchBannersPayload) => {
    return commonAxios.get<AxiosResponseData<FetchBannersResponseData>>(
      "web_banner/index",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default bannerApi;
