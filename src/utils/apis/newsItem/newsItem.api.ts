import { commonAxios } from "@/libs/axios";

import type {
  FetchNewsItemsPayload,
  FetchNewsItemsResponseData,
  FetchNewsItemPayload,
  FetchNewsItemResponseData,
} from "./newsItem.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const newsItemApi = {
  fetchNewsItems: (payload?: FetchNewsItemsPayload) => {
    return commonAxios.get<AxiosResponseData<FetchNewsItemsResponseData>>(
      "news/index",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  fetchNewsItem: (payload: FetchNewsItemPayload) => {
    return commonAxios.get<AxiosResponseData<FetchNewsItemResponseData>>(
      `news/show/${payload.params.id}`,
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default newsItemApi;
