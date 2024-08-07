import { authAxios } from "@/libs/axios";

import type {
  FetchProductSortsPayload,
  FetchProductSortsResponseData,
} from "./productSort.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const productSortApi = {
  fetchProductSorts: (payload?: FetchProductSortsPayload) => {
    return authAxios.get<AxiosResponseData<FetchProductSortsResponseData>>(
      "product_sort/index_by_language",
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
};

export default productSortApi;
