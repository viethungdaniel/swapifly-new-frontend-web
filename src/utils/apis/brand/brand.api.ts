import { commonAxios } from "@/libs/axios";

import type {
  FetchBrandsPayload,
  FetchBrandsResponseData,
} from "./brand.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const brandApi = {
  fetchBrands: (payload?: FetchBrandsPayload) => {
    return commonAxios.get<AxiosResponseData<FetchBrandsResponseData>>(
      "brand/index",
      {
        params: {
          order_by: "sort:desc",
          show: 0,
          ...payload?.params,
        },
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default brandApi;
