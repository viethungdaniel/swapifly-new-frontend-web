import { commonAxios } from "@/libs/axios";

import type {
  FetchProductCategoriesPayload,
  FetchProductCategoryPayload,
  FetchProductCategoryResponseData,
  FetchProductCategoriesResponseData,
} from "./productCategory.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const productCategoryApi = {
  fetchProductCategories: (payload?: FetchProductCategoriesPayload) => {
    return commonAxios.get<
      AxiosResponseData<FetchProductCategoriesResponseData>
    >("category/index", {
      params: {
        order_by: "sort:desc",
        show: 0,
        limit: 1000,
        by_language: 1,
        ...payload?.params,
      },
      cancelToken: payload?.cancelToken,
    });
  },
  fetchProductCategory: (payload: FetchProductCategoryPayload) => {
    const { id } = payload.params;
    return commonAxios.get<AxiosResponseData<FetchProductCategoryResponseData>>(
      `category/show/${id}`,
      {
        cancelToken: payload?.cancelToken,
        headers: payload.headers,
      }
    );
  },
};

export default productCategoryApi;
