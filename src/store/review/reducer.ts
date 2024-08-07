import { ReviewActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { ReviewState, ReviewAction } from "./types";

export const initialState: ReviewState = {
  reviews: [],
  reviewsError: "",
  reviewsLoading: true,
  reviewsCount: 0,
};

const reducer = (state = initialState, action: ReviewAction): ReviewState => {
  switch (action.type) {
    case ReviewActionTypes.FETCH_REQUESTED: {
      const { scope, isReset } = action.payload;

      const newState = {
        ...state,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: true,
            }
          : {}),
        ...(typeof state[`${scope}Error` as keyof typeof state] !== "undefined"
          ? {
              [`${scope}Error`]: "",
            }
          : {}),
      };

      if (isReset) {
        Object.assign(newState, {
          [scope]: Array.isArray(newState[scope]) ? [] : null,
        });
      }

      return newState;
    }
    case ReviewActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count, isLoadMore } = action.payload;

      let newData = data;
      const stateData = state[scope];

      if (isLoadMore && Array.isArray(stateData) && Array.isArray(data)) {
        const filteredData = data.filter((item) => {
          return stateData.every(
            (stateDataItem) => item.id !== stateDataItem.id
          );
        });
        newData = [...stateData, ...filteredData];
      }

      return {
        ...state,
        [scope]: newData,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: false,
            }
          : {}),
        ...(commonHelpers.isNumber(count)
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
    }
    case ReviewActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        ...(typeof state[`${scope}Loading` as keyof typeof state] !==
        "undefined"
          ? {
              [`${scope}Loading`]: false,
            }
          : {}),
        ...(typeof state[`${scope}Error` as keyof typeof state] !== "undefined"
          ? {
              [`${scope}Error`]: error,
            }
          : {}),
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
