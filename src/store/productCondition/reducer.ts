import { ProductConditionActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { ProductConditionState, ProductConditionAction } from "./types";

export const initialState: ProductConditionState = {
  productConditions: [],
  productConditionsError: "",
  productConditionsLoading: true,
};

const reducer = (
  state = initialState,
  action: ProductConditionAction
): ProductConditionState => {
  switch (action.type) {
    case ProductConditionActionTypes.FETCH_REQUESTED: {
      const { scope } = action.payload;

      return {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };
    }
    case ProductConditionActionTypes.FETCH_SUCCEEDED: {
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
    case ProductConditionActionTypes.FETCH_FAILED: {
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
