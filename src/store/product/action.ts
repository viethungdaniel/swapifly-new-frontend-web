import { ProductActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  FetchProductSucceededSeverAction,
  FetchDraftProductSucceededSeverAction,
  MapFetchRequestedAction,
  MapFetchSucceededAction,
  MapFetchFailedAction,
  SetAllProductBookmarkedAction,
  SetAllProductLikedAction,
  SetAllProductStateAction,
  SetDraftProductAction,
  DeleteDraftProductSucceedAction,
  // Saga
  FetchDraftProductSagaAction,
  FetchDraftProductsSagaAction,
  FetchUserProductsSagaAction,
  FetchSimilarProductsSagaAction,
  FetchBookmarkedProductsSagaAction,
  FetchCurrentBookmarkedProductsCountSagaAction,
  FetchMapHomeProductsByProductCategoryIdSagaAction,
  FetchRecommendedHomeProductsSagaAction,
  FetchRecommendedProductsSagaAction,
  FetchProductsSagaAction,
  FetchProductSagaAction,
  AddProductBookmarkedSagaAction,
  RemoveProductBookmarkedSagaAction,
  LikeProductSagaAction,
  MarkSoldProductSagaAction,
  DeleteProductSagaAction,
  DeleteDraftProductSagaAction,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: ProductActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: ProductActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: ProductActionTypes.FETCH_FAILED,
  payload,
});

export const mapFetchRequested = (
  payload: MapFetchRequestedAction["payload"]
): MapFetchRequestedAction => ({
  type: ProductActionTypes.MAP_FETCH_REQUESTED,
  payload,
});

export const mapFetchSucceeded = (
  payload: MapFetchSucceededAction["payload"]
): MapFetchSucceededAction => ({
  type: ProductActionTypes.MAP_FETCH_SUCCEEDED,
  payload,
});

export const mapFetchFailed = (
  payload: MapFetchFailedAction["payload"]
): MapFetchFailedAction => ({
  type: ProductActionTypes.MAP_FETCH_FAILED,
  payload,
});

export const fetchProductSucceededSever = (
  payload: FetchProductSucceededSeverAction["payload"]
): FetchProductSucceededSeverAction => ({
  type: ProductActionTypes.FETCH_PRODUCT_SUCCEEDED_SERVER,
  payload,
});

export const fetchDraftProductSucceededSever = (
  payload: FetchDraftProductSucceededSeverAction["payload"]
): FetchDraftProductSucceededSeverAction => ({
  type: ProductActionTypes.FETCH_DRAFT_PRODUCT_SUCCEEDED_SERVER,
  payload,
});

export const setAllProductBookmarked = (
  payload: SetAllProductBookmarkedAction["payload"]
): SetAllProductBookmarkedAction => ({
  type: ProductActionTypes.SET_ALL_PRODUCT_BOOKMARKED,
  payload,
});

export const setAllProductLiked = (
  payload: SetAllProductLikedAction["payload"]
): SetAllProductLikedAction => ({
  type: ProductActionTypes.SET_ALL_PRODUCT_LIKED,
  payload,
});

export const setAllProductState = (
  payload: SetAllProductStateAction["payload"]
): SetAllProductStateAction => ({
  type: ProductActionTypes.SET_ALL_PRODUCT_STATE,
  payload,
});

export const setDraftProduct = (
  payload: SetDraftProductAction["payload"]
): SetDraftProductAction => ({
  type: ProductActionTypes.SET_DRAFT_PRODUCT_SAGA,
  payload,
});

export const deleteDraftProductSucceeded = (
  payload: DeleteDraftProductSucceedAction["payload"]
): DeleteDraftProductSucceedAction => ({
  type: ProductActionTypes.DELETE_DRAFT_PRODUCT_SUCCEEDED,
  payload,
});

// Saga

export const fetchDraftProductSaga = (
  payload: FetchDraftProductSagaAction["payload"],
  meta?: FetchDraftProductSagaAction["meta"]
): FetchDraftProductSagaAction => ({
  type: ProductActionTypes.FETCH_DRAFT_PRODUCT_SAGA,
  payload,
  meta,
});

export const fetchDraftProductsSaga = (
  payload?: FetchDraftProductsSagaAction["payload"],
  meta?: FetchDraftProductsSagaAction["meta"]
): FetchDraftProductsSagaAction => ({
  type: ProductActionTypes.FETCH_DRAFT_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchProductsSaga = (
  payload?: FetchProductsSagaAction["payload"],
  meta?: FetchProductsSagaAction["meta"]
): FetchProductsSagaAction => ({
  type: ProductActionTypes.FETCH_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchUserProductsSaga = (
  payload: FetchUserProductsSagaAction["payload"],
  meta?: FetchUserProductsSagaAction["meta"]
): FetchUserProductsSagaAction => ({
  type: ProductActionTypes.FETCH_USER_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchSimilarProductsSaga = (
  payload: FetchSimilarProductsSagaAction["payload"],
  meta?: FetchSimilarProductsSagaAction["meta"]
): FetchSimilarProductsSagaAction => ({
  type: ProductActionTypes.FETCH_SIMILAR_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchProductSaga = (
  payload: FetchProductSagaAction["payload"],
  meta?: FetchProductSagaAction["meta"]
): FetchProductSagaAction => ({
  type: ProductActionTypes.FETCH_PRODUCT_SAGA,
  payload,
  meta,
});

export const fetchRecommendedHomeProductsSaga = (
  payload?: FetchRecommendedHomeProductsSagaAction["payload"],
  meta?: FetchRecommendedHomeProductsSagaAction["meta"]
): FetchRecommendedHomeProductsSagaAction => ({
  type: ProductActionTypes.FETCH_RECOMMENDED_HOME_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchRecommendedProductsSaga = (
  payload?: FetchRecommendedProductsSagaAction["payload"],
  meta?: FetchRecommendedProductsSagaAction["meta"]
): FetchRecommendedProductsSagaAction => ({
  type: ProductActionTypes.FETCH_RECOMMENDED_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchBookmarkedProductsSaga = (
  payload?: FetchBookmarkedProductsSagaAction["payload"],
  meta?: FetchBookmarkedProductsSagaAction["meta"]
): FetchBookmarkedProductsSagaAction => ({
  type: ProductActionTypes.FETCH_BOOKMARKED_PRODUCTS_SAGA,
  payload,
  meta,
});

export const fetchCurrentBookmarkedProductsCountSaga = (
  payload?: FetchCurrentBookmarkedProductsCountSagaAction["payload"],
  meta?: FetchCurrentBookmarkedProductsCountSagaAction["meta"]
): FetchCurrentBookmarkedProductsCountSagaAction => ({
  type: ProductActionTypes.FETCH_CURRENT_BOOKMARKED_PRODUCTS_COUNT_SAGA,
  payload,
  meta,
});

export const fetchMapHomeProductsByProductCategoryIdSaga = (
  payload: FetchMapHomeProductsByProductCategoryIdSagaAction["payload"],
  meta?: FetchMapHomeProductsByProductCategoryIdSagaAction["meta"]
): FetchMapHomeProductsByProductCategoryIdSagaAction => ({
  type: ProductActionTypes.FETCH_MAP_HOME_PRODUCTS_BY_PRODUCT_CATEGORY_ID_SAGA,
  payload,
  meta,
});

export const addProductBookmarkedSaga = (
  payload: AddProductBookmarkedSagaAction["payload"],
  meta?: AddProductBookmarkedSagaAction["meta"]
): AddProductBookmarkedSagaAction => ({
  type: ProductActionTypes.ADD_PRODUCT_BOOKMARKED_SAGA,
  payload,
  meta,
});

export const removeProductBookmarkedSaga = (
  payload: RemoveProductBookmarkedSagaAction["payload"],
  meta?: RemoveProductBookmarkedSagaAction["meta"]
): RemoveProductBookmarkedSagaAction => ({
  type: ProductActionTypes.REMOVE_PRODUCT_BOOKMARKED_SAGA,
  payload,
  meta,
});

export const likeProductSaga = (
  payload: LikeProductSagaAction["payload"],
  meta?: LikeProductSagaAction["meta"]
): LikeProductSagaAction => ({
  type: ProductActionTypes.LIKE_PRODUCT_SAGA,
  payload,
  meta,
});

export const markSoldProductSaga = (
  payload: MarkSoldProductSagaAction["payload"],
  meta?: MarkSoldProductSagaAction["meta"]
): MarkSoldProductSagaAction => ({
  type: ProductActionTypes.MARK_SOLD_PRODUCT_SAGA,
  payload,
  meta,
});

export const deleteProductSaga = (
  payload: DeleteProductSagaAction["payload"],
  meta?: DeleteProductSagaAction["meta"]
): DeleteProductSagaAction => ({
  type: ProductActionTypes.DELETE_PRODUCT_SAGA,
  payload,
  meta,
});

export const deleteDraftProductSaga = (
  payload: DeleteDraftProductSagaAction["payload"],
  meta?: DeleteDraftProductSagaAction["meta"]
): DeleteDraftProductSagaAction => ({
  type: ProductActionTypes.DELETE_DRAFT_PRODUCT_SAGA,
  payload,
  meta,
});
