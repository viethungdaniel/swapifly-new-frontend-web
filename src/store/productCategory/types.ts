import type {
  FetchProductCategoriesPayload,
  FetchProductCategoriesResponseData,
} from "@/utils/apis/productCategory/productCategory.api.types";

// Action Types

export enum ProductCategoryActionTypes {
  FETCH_REQUESTED = "@@productCategory/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@productCategory/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@productCategory/FETCH_FAILED",

  // Saga
  FETCH_PRODUCT_CATEGORIES_SAGA = "@@productCategories/FETCH_PRODUCT_CATEGORIES_SAGA",
}

// State

export type ProductCategories = Array<
  FetchProductCategoriesResponseData["data"][number] & {
    is_last_product_category: boolean;
    child_product_categories: ProductCategoriesTrees;
    child_product_category_ids: number[];
  }
>;

export type ProductCategoriesTrees = ProductCategories;

export interface ProductCategoryState {
  productCategories: ProductCategories;
  productCategoriesLoading: boolean;
  productCategoriesError: string;
}

// ---- Reducer ----

export type FetchScope = "productCategories";

export type FetchRequestedAction = {
  type: ProductCategoryActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
  };
};

export type FetchSucceededAction = {
  type: ProductCategoryActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: ProductCategoryState[FetchScope];
    count?: number;
  };
};

export type FetchFailedAction = {
  type: ProductCategoryActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

// ---- Saga ----

export type FetchProductCategoriesSagaAction = {
  type: ProductCategoryActionTypes.FETCH_PRODUCT_CATEGORIES_SAGA;
  payload?: FetchProductCategoriesPayload;
  meta?: {
    resolve?: Function;
  };
};

export type ProductCategoryAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  //
  | FetchProductCategoriesSagaAction;
