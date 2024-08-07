import { authAxios } from "@/libs/axios";

import type {
  FetchProductsPayload,
  FetchProductsResponseData,
  FetchRecommendedProductsPayload,
  FetchRecommendedProductsResponseData,
  FetchBookmarkedProductsPayload,
  FetchBookmarkedProductsResponseData,
  FetchSimilarProductsPayload,
  FetchSimilarProductsResponseData,
  FetchProductPayload,
  FetchProductResponseData,
  AddProductBookmarkPayload,
  RemoveProductBookmarkPayload,
  LikeProductPayload,
  ReportProductPayload,
  DeleteProductPayload,
  MarkSoldProductPayload,
  FetchDraftProductsPayload,
  FetchDraftProductsResponseData,
  AddDraftProductPayload,
  UpdateDraftProductPayload,
  DeleteDraftProductPayload,
  FetchDraftProductPayload,
  FetchDraftProductResponseData,
  UpdateProductPayload,
  AddProductPayload,
} from "./product.api.types";
import type { AxiosResponseData } from "@/libs/axios";

const productApi = {
  fetchDraftProducts: (payload?: FetchDraftProductsPayload) => {
    return authAxios.get<AxiosResponseData<FetchDraftProductsResponseData>>(
      `product_drafts`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchDraftProduct: (payload: FetchDraftProductPayload) => {
    const { id } = payload.params;
    return authAxios.get<AxiosResponseData<FetchDraftProductResponseData>>(
      `product_drafts/${id}`,
      {
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  addDraftProduct: (payload: AddDraftProductPayload) => {
    return authAxios.post<AxiosResponseData>(`product_drafts`, payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  updateDraftProduct: (payload: UpdateDraftProductPayload) => {
    const { id, ...params } = payload.params;
    return authAxios.put<AxiosResponseData>(`product_drafts/${id}`, params, {
      cancelToken: payload?.cancelToken,
    });
  },
  updateProduct: (payload: UpdateProductPayload) => {
    const { id, ...params } = payload.params;
    return authAxios.put<AxiosResponseData>(`product/update/${id}`, params, {
      cancelToken: payload?.cancelToken,
    });
  },
  deleteDraftProduct: (payload: DeleteDraftProductPayload) => {
    const { id } = payload.params;
    return authAxios.delete<AxiosResponseData>(`product_drafts/${id}`, {
      cancelToken: payload?.cancelToken,
    });
  },
  fetchProducts: (payload?: FetchProductsPayload) => {
    return authAxios.get<AxiosResponseData<FetchProductsResponseData>>(
      "product/index",
      {
        params: payload?.params,
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  fetchSimilarProducts: (payload: FetchSimilarProductsPayload) => {
    const { id, ...params } = payload.params;

    return authAxios.get<AxiosResponseData<FetchSimilarProductsResponseData>>(
      `product/similar_list/${id}`,
      {
        params,
        cancelToken: payload?.cancelToken,
      }
    );
  },
  fetchRecommendedProducts: (payload?: FetchRecommendedProductsPayload) => {
    return authAxios.get<
      AxiosResponseData<FetchRecommendedProductsResponseData>
    >("product/get_recommend_list", {
      params: payload?.params,
      cancelToken: payload?.cancelToken,
    });
  },
  fetchBookmarkedProducts: (payload?: FetchBookmarkedProductsPayload) => {
    return authAxios.get<
      AxiosResponseData<FetchBookmarkedProductsResponseData>
    >("product/list_bookmark", {
      params: payload?.params,
      cancelToken: payload?.cancelToken,
    });
  },
  fetchProduct: (payload: FetchProductPayload) => {
    const { id, ...params } = payload.params;
    return authAxios.get<AxiosResponseData<FetchProductResponseData>>(
      `product/show/${id}`,
      {
        params,
        cancelToken: payload?.cancelToken,
        headers: payload?.headers,
      }
    );
  },
  addProduct: (payload: AddProductPayload) => {
    return authAxios.post<AxiosResponseData>(`product/add`, payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  addProductBookmark: (payload: AddProductBookmarkPayload) => {
    return authAxios.post<AxiosResponseData>(
      `user/add_product_bookmark/${payload.params.id}`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  removeProductBookMark: (payload: RemoveProductBookmarkPayload) => {
    return authAxios.delete<AxiosResponseData>(
      `user/remove_product_bookmark/${payload.params.id}`,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  likeProduct: (payload: LikeProductPayload) => {
    return authAxios.post<AxiosResponseData>(`product/like`, payload.params, {
      cancelToken: payload?.cancelToken,
    });
  },
  reportProduct: (payload: ReportProductPayload) => {
    return authAxios.post<AxiosResponseData>(
      `user/report_product`,
      payload.params,
      {
        cancelToken: payload?.cancelToken,
      }
    );
  },
  markSoldProduct: (payload: MarkSoldProductPayload) => {
    const { id } = payload.params;
    return authAxios.post<AxiosResponseData>(`product/soldout/${id}`, {
      cancelToken: payload?.cancelToken,
    });
  },
  deleteProduct: (payload: DeleteProductPayload) => {
    const { id } = payload.params;
    return authAxios.delete<AxiosResponseData>(`product/delete/${id}`, {
      cancelToken: payload?.cancelToken,
    });
  },
};

export default productApi;
