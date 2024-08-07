import { ProductSortActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { ProductSortState, ProductSortAction } from "./types";

export const initialState: ProductSortState = {
  productSorts: [],
  productSortsError: "",
  productSortsLoading: true,
};

const reducer = (
  state = initialState,
  action: ProductSortAction
): ProductSortState => {
  switch (action.type) {
    case ProductSortActionTypes.FETCH_REQUESTED: {
      const { scope } = action.payload;

      return {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };
    }
    case ProductSortActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count } = action.payload;

      return {
        ...state,
        [scope]: data,
        [`${scope}Loading`]: false,
        ...(commonHelpers.isNumber(count)
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
    }
    case ProductSortActionTypes.FETCH_FAILED: {
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
