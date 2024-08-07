import { ProductCategoryActionTypes } from "./types";

import { commonHelpers } from "@/utils/helpers";

import type { ProductCategoryState, ProductCategoryAction } from "./types";

export const initialState: ProductCategoryState = {
  productCategories: [],
  productCategoriesError: "",
  productCategoriesLoading: false,
};

const reducer = (
  state = initialState,
  action: ProductCategoryAction
): ProductCategoryState => {
  switch (action.type) {
    case ProductCategoryActionTypes.FETCH_REQUESTED: {
      const { scope } = action.payload;

      return {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };
    }
    case ProductCategoryActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count } = action.payload;

      const newState = {
        ...state,
        [scope]: data,
        [`${scope}Loading`]: false,
        ...(commonHelpers.isNumber(count)
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
      return newState;
    }

    case ProductCategoryActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        [`${scope}Error`]: error,
        [`${scope}Loading`]: false,
      };
    }
    default: {
      return state;
    }
  }
};

export default reducer;
