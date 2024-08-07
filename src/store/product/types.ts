import type {
  AddProductBookmarkPayload,
  DeleteDraftProductPayload,
  DeleteProductPayload,
  FetchBookmarkedProductsPayload,
  FetchDraftProductPayload,
  FetchDraftProductResponseData,
  FetchDraftProductsPayload,
  FetchDraftProductsResponseData,
  FetchProductPayload,
  FetchProductResponseData,
  FetchProductsPayload,
  FetchProductsResponseData,
  FetchRecommendedProductsPayload,
  FetchSimilarProductsPayload,
  FetchSimilarProductsResponseData,
  LikeProductPayload,
  MarkSoldProductPayload,
  RemoveProductBookmarkPayload,
} from "@/utils/apis/product";

export enum ProductActionTypes {
  FETCH_REQUESTED = "@@product/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@product/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@product/FETCH_FAILED",

  FETCH_PRODUCT_SUCCEEDED_SERVER = "@@product/FETCH_PRODUCT_SUCCEEDED_SERVER",
  FETCH_DRAFT_PRODUCT_SUCCEEDED_SERVER = "@@product/FETCH_DRAFT_PRODUCT_SUCCEEDED_SERVER",

  MAP_FETCH_REQUESTED = "@@product/MAP_FETCH_REQUESTED",
  MAP_FETCH_SUCCEEDED = "@@product/MAP_FETCH_SUCCEEDED",
  MAP_FETCH_FAILED = "@@product/MAP_FETCH_FAILED",

  DELETE_DRAFT_PRODUCT_SUCCEEDED = "@@product/DELETE_DRAFT_PRODUCT_SUCCEEDED",

  SET_ALL_PRODUCT_BOOKMARKED = "@@product/SET_ALL_PRODUCT_BOOKMARKED",
  SET_ALL_PRODUCT_LIKED = "@@product/SET_ALL_PRODUCT_LIKED",
  SET_ALL_PRODUCT_STATE = "@@product/SET_ALL_PRODUCT_STATE",
  SET_DRAFT_PRODUCT_SAGA = "@@product/SET_DRAFT_PRODUCT_SAGA",

  // Saga
  FETCH_DRAFT_PRODUCTS_SAGA = "@@product/FETCH_DRAFT_PRODUCTS_SAGA",
  FETCH_DRAFT_PRODUCT_SAGA = "@@product/FETCH_DRAFT_PRODUCT_SAGA",
  FETCH_PRODUCTS_SAGA = "@@product/FETCH_PRODUCTS_SAGA",
  FETCH_USER_PRODUCTS_SAGA = "@@product/FETCH_USER_PRODUCTS_SAGA",
  FETCH_SIMILAR_PRODUCTS_SAGA = "@@product/FETCH_SIMILAR_PRODUCTS_SAGA",
  FETCH_RECOMMENDED_HOME_PRODUCTS_SAGA = "@@product/FETCH_RECOMMENDED_HOME_PRODUCTS_SAGA",
  FETCH_RECOMMENDED_PRODUCTS_SAGA = "@@product/FETCH_RECOMMENDED_PRODUCTS_SAGA",
  FETCH_BOOKMARKED_PRODUCTS_SAGA = "@@product/FETCH_BOOKMARKED_PRODUCTS_SAGA",
  FETCH_CURRENT_BOOKMARKED_PRODUCTS_COUNT_SAGA = "@@product/FETCH_CURRENT_BOOKMARKED_PRODUCTS_COUNT_SAGA",
  FETCH_PRODUCT_SAGA = "@@product/FETCH_PRODUCT_SAGA",
  FETCH_MAP_HOME_PRODUCTS_BY_PRODUCT_CATEGORY_ID_SAGA = "@@product/FETCH_MAP_HOME_PRODUCTS_BY_PRODUCT_CATEGORY_ID_SAGA",
  ADD_PRODUCT_BOOKMARKED_SAGA = "@@product/ADD_PRODUCT_BOOKMARKED_SAGA",
  REMOVE_PRODUCT_BOOKMARKED_SAGA = "@@product/REMOVE_PRODUCT_BOOKMARKED_SAGA",
  DELETE_DRAFT_PRODUCT_SAGA = "@@product/DELETE_DRAFT_PRODUCT_SAGA",
  LIKE_PRODUCT_SAGA = "@@product/LIKE_PRODUCT_SAGA",
  MARK_SOLD_PRODUCT_SAGA = "@@product/MARK_SOLD_PRODUCT_SAGA",
  DELETE_PRODUCT_SAGA = "@@product/DELETE_PRODUCT_SAGA",
}

// State

export interface ProductState {
  hydrated?: boolean;

  draftProducts: FetchDraftProductsResponseData;
  draftProductsLoading: boolean;
  draftProductsError: string;

  draftProduct: Partial<FetchDraftProductResponseData> | null;
  draftProductLoading: boolean;
  draftProductError: string;

  products: FetchProductsResponseData["data"];
  productsLoading: boolean;
  productsError: string;
  productsCount: number;

  similarProducts: FetchSimilarProductsResponseData["data"];
  similarProductsError: string;
  similarProductsLoading: boolean;
  similarProductsCount: number;

  product: FetchProductResponseData | null;
  productLoading: boolean;
  productError: string;

  recommendedHomeProducts: FetchProductsResponseData["data"];
  recommendedHomeProductsLoading: boolean;
  recommendedHomeProductsError: string;
  recommendedHomeProductsCount: number;

  recommendedProducts: FetchProductsResponseData["data"];
  recommendedProductsLoading: boolean;
  recommendedProductsError: string;
  recommendedProductsCount: number;

  userProducts: FetchProductsResponseData["data"];
  userProductsLoading: boolean;
  userProductsError: string;
  userProductsCount: number;

  bookmarkedProducts: FetchProductsResponseData["data"];
  bookmarkedProductsLoading: boolean;
  bookmarkedProductsError: string;
  bookmarkedProductsCount: number;
  currentBookmarkedProductsCount: number;

  productCategoryIdToHomeProductsMap: {
    [productCategoryId: number]: FetchProductsResponseData["data"];
  };
  productCategoryIdToHomeProductsLoadingMap: {
    [productCategoryId: number]: boolean;
  };
  productCategoryIdToHomeProductsErrorMap: {
    [productCategoryId: number]: string;
  };
}

// ---- Reducer Action ----

export type FetchScope =
  | "products"
  | "product"
  | "draftProducts"
  | "draftProduct"
  | "userProducts"
  | "recommendedHomeProducts"
  | "recommendedProducts"
  | "similarProducts"
  | "bookmarkedProducts"
  | "currentBookmarkedProductsCount";
export type MapFetchScope = "productCategoryIdToHomeProducts";

export type MapFetchRequestedAction = {
  type: ProductActionTypes.MAP_FETCH_REQUESTED;
  payload: {
    scope: MapFetchScope;
    key: any;
  };
};

export type MapFetchSucceededAction = {
  type: ProductActionTypes.MAP_FETCH_SUCCEEDED;
  payload: {
    scope: MapFetchScope;
    key: any;
    data: ProductState[`${MapFetchScope}Map`][MapFetchSucceededAction["payload"]["key"]];
  };
};

export type MapFetchFailedAction = {
  type: ProductActionTypes.MAP_FETCH_FAILED;
  payload: {
    scope: MapFetchScope;
    key: any;
    error: string;
  };
};

export type FetchRequestedAction = {
  type: ProductActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: ProductActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: ProductState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: ProductActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type SetAllProductLikedAction = {
  type: ProductActionTypes.SET_ALL_PRODUCT_LIKED;
  payload: {
    id: number;
    liked: boolean;
  };
};

export type SetAllProductBookmarkedAction = {
  type: ProductActionTypes.SET_ALL_PRODUCT_BOOKMARKED;
  payload: {
    id: number;
    bookmarked: boolean;
  };
};

export type SetAllProductStateAction = {
  type: ProductActionTypes.SET_ALL_PRODUCT_STATE;
  payload: {
    id: number;
    state: number;
  };
};

export type SetDraftProductAction = {
  type: ProductActionTypes.SET_DRAFT_PRODUCT_SAGA;
  payload: Partial<FetchDraftProductResponseData> | null;
};

export type DeleteDraftProductSucceedAction = {
  type: ProductActionTypes.DELETE_DRAFT_PRODUCT_SUCCEEDED;
  payload: {
    id: number;
  };
};

export type FetchProductSucceededSeverAction = {
  type: ProductActionTypes.FETCH_PRODUCT_SUCCEEDED_SERVER;
  payload: FetchProductResponseData;
};

export type FetchDraftProductSucceededSeverAction = {
  type: ProductActionTypes.FETCH_DRAFT_PRODUCT_SUCCEEDED_SERVER;
  payload: Partial<FetchDraftProductResponseData>;
};

// ---- Saga Action ----

export type FetchDraftProductsSagaAction = {
  type: ProductActionTypes.FETCH_DRAFT_PRODUCTS_SAGA;
  payload?: FetchDraftProductsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchDraftProductSagaAction = {
  type: ProductActionTypes.FETCH_DRAFT_PRODUCT_SAGA;
  payload: FetchDraftProductPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchProductsSagaAction = {
  type: ProductActionTypes.FETCH_PRODUCTS_SAGA;
  payload?: FetchProductsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchUserProductsSagaAction = {
  type: ProductActionTypes.FETCH_USER_PRODUCTS_SAGA;
  payload: FetchProductsPayload & {
    params: FetchProductsPayload["params"] & {
      uid: number;
    };
  };
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchSimilarProductsSagaAction = {
  type: ProductActionTypes.FETCH_SIMILAR_PRODUCTS_SAGA;
  payload: FetchSimilarProductsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchBookmarkedProductsSagaAction = {
  type: ProductActionTypes.FETCH_BOOKMARKED_PRODUCTS_SAGA;
  payload?: FetchBookmarkedProductsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchCurrentBookmarkedProductsCountSagaAction = {
  type: ProductActionTypes.FETCH_CURRENT_BOOKMARKED_PRODUCTS_COUNT_SAGA;
  payload?: FetchBookmarkedProductsPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchProductSagaAction = {
  type: ProductActionTypes.FETCH_PRODUCT_SAGA;
  payload: FetchProductPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchRecommendedHomeProductsSagaAction = {
  type: ProductActionTypes.FETCH_RECOMMENDED_HOME_PRODUCTS_SAGA;
  payload?: FetchRecommendedProductsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchRecommendedProductsSagaAction = {
  type: ProductActionTypes.FETCH_RECOMMENDED_PRODUCTS_SAGA;
  payload?: FetchRecommendedProductsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchMapHomeProductsByProductCategoryIdSagaAction = {
  type: ProductActionTypes.FETCH_MAP_HOME_PRODUCTS_BY_PRODUCT_CATEGORY_ID_SAGA;
  payload: Omit<FetchProductsPayload, "params"> & {
    params: Omit<NonNullable<FetchProductsPayload["params"]>, "rid"> & {
      rid: number;
    };
  };
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type AddProductBookmarkedSagaAction = {
  type: ProductActionTypes.ADD_PRODUCT_BOOKMARKED_SAGA;
  payload: AddProductBookmarkPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type RemoveProductBookmarkedSagaAction = {
  type: ProductActionTypes.REMOVE_PRODUCT_BOOKMARKED_SAGA;
  payload: RemoveProductBookmarkPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type DeleteDraftProductSagaAction = {
  type: ProductActionTypes.DELETE_DRAFT_PRODUCT_SAGA;
  payload: DeleteDraftProductPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type LikeProductSagaAction = {
  type: ProductActionTypes.LIKE_PRODUCT_SAGA;
  payload: LikeProductPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type MarkSoldProductSagaAction = {
  type: ProductActionTypes.MARK_SOLD_PRODUCT_SAGA;
  payload: MarkSoldProductPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type DeleteProductSagaAction = {
  type: ProductActionTypes.DELETE_PRODUCT_SAGA;
  payload: DeleteProductPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type ProductAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | FetchProductSucceededSeverAction
  | FetchDraftProductSucceededSeverAction
  | MapFetchRequestedAction
  | MapFetchSucceededAction
  | MapFetchFailedAction
  | SetAllProductLikedAction
  | SetAllProductBookmarkedAction
  | SetAllProductStateAction
  | SetDraftProductAction
  | DeleteDraftProductSucceedAction
  //
  | FetchUserProductsSagaAction
  | FetchMapHomeProductsByProductCategoryIdSagaAction
  | FetchRecommendedHomeProductsSagaAction
  | FetchRecommendedProductsSagaAction
  | FetchCurrentBookmarkedProductsCountSagaAction
  | FetchBookmarkedProductsSagaAction
  | FetchProductsSagaAction
  | FetchSimilarProductsSagaAction
  | FetchProductSagaAction
  | AddProductBookmarkedSagaAction
  | RemoveProductBookmarkedSagaAction
  | LikeProductSagaAction
  | MarkSoldProductSagaAction
  | DeleteProductSagaAction
  | DeleteDraftProductSagaAction
  | FetchDraftProductSagaAction
  | FetchDraftProductsSagaAction;
