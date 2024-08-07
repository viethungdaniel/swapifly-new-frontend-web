import { createSelector } from "@reduxjs/toolkit";

import { productCategoryHelpers } from "@/utils/helpers";
import { ProductCategoriesTrees } from "./types";

import type { AppState } from "@/store";

export const selectProductCategories = (state: AppState) =>
  state.productCategory.productCategories;
export const selectProductCategoriesError = (state: AppState) =>
  state.productCategory.productCategoriesError;
export const selectProductCategoriesLoading = (state: AppState) =>
  state.productCategory.productCategoriesLoading;

export const selectMainProductCategoryIds = createSelector(
  selectProductCategories,
  (productCategories) => {
    return productCategories
      .filter((productCategory) => !productCategory.pid)
      .map((productCategory) => productCategory.id);
  }
);

export const selectProductCategoriesTrees = createSelector(
  selectProductCategories,
  (productCategories) => {
    const productCategoriesTrees =
      productCategoryHelpers.mapListToTreeList(productCategories);
    return productCategoriesTrees;
  }
);

export const selectIdToProductCategoriesTreesMap = createSelector(
  selectProductCategories,
  (productCategories) => {
    const idToProductCategoriesTreesMap =
      productCategoryHelpers.mapListToIdTreeMap(productCategories) as {
        [id: number]: ProductCategoriesTrees[number];
      };
    return idToProductCategoriesTreesMap;
  }
);

export const selectBreadcrumbProductCategories = createSelector(
  selectIdToProductCategoriesTreesMap,
  (_: AppState, productCategoryId: number | null) => productCategoryId,
  (productCategoriesTrees, productCategoryId) => {
    const breadcrumbs = [] as (typeof productCategoriesTrees)[number][];

    const addBreadcrumb = (productCategoryId: number) => {
      const productCategory = productCategoriesTrees[productCategoryId];
      if (!!productCategory) {
        breadcrumbs.unshift(productCategory);
        productCategory.pid && addBreadcrumb(productCategory.pid);
      }
    };

    productCategoryId && addBreadcrumb(productCategoryId);

    return breadcrumbs;
  }
);
