import _uniq from "lodash/uniq";
import { commonHelpers } from "@/utils/helpers";

import type { FetchProductCategoriesResponseData } from "@/utils/apis/productCategory/productCategory.api.types";
import type {
  ProductCategories,
  ProductCategoriesTrees,
} from "@/store/productCategory/types";

export const mapListToTreeList = <P extends ProductCategoriesTrees>(
  productCategories: P
) => {
  const productCategoriesTrees = [] as ProductCategoriesTrees;
  const idToProductCategoryMap = {} as {
    [id: number]: ProductCategoriesTrees[number];
  };

  productCategories.forEach((productCategory) => {
    Object.assign(idToProductCategoryMap, {
      [productCategory.id]: {
        ...productCategory,
      } as ProductCategoriesTrees[number],
    });
  });

  productCategories.forEach((productCategory) => {
    if (commonHelpers.isEmpty(idToProductCategoryMap[productCategory.pid])) {
      productCategoriesTrees.push(idToProductCategoryMap[productCategory.id]);
    }
  });

  return productCategoriesTrees;
};

export const mapListToIdTreeMap = <P extends ProductCategories>(
  productCategories: P
) => {
  const idToProductCategoryMap = {} as {
    [id: number]: ProductCategoriesTrees[number];
  };

  productCategories.forEach((productCategory) => {
    Object.assign(idToProductCategoryMap, {
      [productCategory.id]: {
        ...productCategory,
      } as unknown as ProductCategoriesTrees[number],
    });
  });

  return idToProductCategoryMap;
};

export const mapProductCategories = <
  P extends FetchProductCategoriesResponseData["data"]
>(
  productCategories: P
) => {
  const sortedProductCategories = [...productCategories].sort(
    (productCategoryA, productCategoryB) =>
      productCategoryB.sort - productCategoryA.sort
  );
  const newProductCategories = [] as ProductCategories;
  const idToProductCategoryMap = {} as {
    [id: number]: ProductCategoriesTrees[number];
  };

  sortedProductCategories.forEach((productCategory) => {
    Object.assign(idToProductCategoryMap, {
      [productCategory.id]: {
        ...productCategory,
        title: commonHelpers.isEmpty(productCategory.title)
          ? ""
          : productCategory.title,
        child_product_categories: [],
        child_product_category_ids: [],
        is_last_product_category: true,
      } as ProductCategoriesTrees[number],
    });
  });

  sortedProductCategories.forEach((productCategory) => {
    if (!commonHelpers.isEmpty(idToProductCategoryMap[productCategory.pid])) {
      idToProductCategoryMap[productCategory.pid].child_product_categories.push(
        idToProductCategoryMap[productCategory.id]
      );
      idToProductCategoryMap[productCategory.pid].is_last_product_category =
        false;
      const updateChildProductCategoryIds = (
        productCategoryId: number,
        productCategoryParentId: number,
        productCategoryParentChildId: number[]
      ) => {
        if (
          !commonHelpers.isEmpty(
            idToProductCategoryMap[productCategoryParentId]
          )
        ) {
          const newNextIds = [
            productCategoryId,
            ...productCategoryParentChildId,
          ];

          idToProductCategoryMap[
            productCategoryParentId
          ].child_product_category_ids = _uniq(
            idToProductCategoryMap[
              productCategoryParentId
            ].child_product_category_ids.concat(newNextIds)
          );
          updateChildProductCategoryIds(
            idToProductCategoryMap[productCategoryParentId].id,
            idToProductCategoryMap[productCategoryParentId].pid,
            idToProductCategoryMap[productCategoryParentId]
              .child_product_category_ids
          );
        }
      };
      updateChildProductCategoryIds(
        productCategory.id,
        productCategory.pid,
        idToProductCategoryMap[productCategory.pid].child_product_category_ids
      );
    }
    newProductCategories.push(idToProductCategoryMap[productCategory.id]);
  });

  return newProductCategories;
};
