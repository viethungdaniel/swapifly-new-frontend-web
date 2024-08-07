import { authAxios } from "@/libs/axios";

import type {
  FetchAdsPayload,
  FetchAdsResponseData,
  SubmitAdsClickEventPayload,
} from "./ad.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const adApi = {
  fetchAds: (payload: FetchAdsPayload) => {
    return authAxios.get<AxiosResponseData<FetchAdsResponseData>>("ad/index", {
      params: payload.params,
      cancelToken: payload?.cancelToken,
    });
  },
  submitAdsClickEvent: (payload: SubmitAdsClickEventPayload) => {
    return authAxios.get<AxiosResponseData>("ad/index", {
      cancelToken: payload?.cancelToken,
    });
  },
};

export default adApi;
