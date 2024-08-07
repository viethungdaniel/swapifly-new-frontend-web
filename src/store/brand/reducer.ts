import { BrandActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { BrandState, BrandAction } from "./types";

export const initialState: BrandState = {
  brands: [],
  brandsError: "",
  brandsLoading: true,
  brandsCount: 0,
};

const reducer = (state = initialState, action: BrandAction): BrandState => {
  switch (action.type) {
    case BrandActionTypes.FETCH_REQUESTED: {
      const { scope, isReset } = action.payload;

      const newState = {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };

      if (isReset) {
        Object.assign(newState, {
          [scope]: Array.isArray(newState[scope]) ? [] : null,
        });
      }

      return newState;
    }
    case BrandActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count, isLoadMore } = action.payload;

      let newData = data;

      if (isLoadMore && Array.isArray(state[scope])) {
        const filteredData = data.filter((item) => {
          return state[scope].every((stateData) => item.id !== stateData.id);
        });
        newData = [...state[scope], ...filteredData];
      }

      return {
        ...state,
        [scope]: newData,
        [`${scope}Loading`]: false,
        ...(commonHelpers.isNumber(count)
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
    }
    case BrandActionTypes.FETCH_FAILED: {
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
