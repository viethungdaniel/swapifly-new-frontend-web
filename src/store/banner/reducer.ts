import { BannerActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { BannerState, BannerAction } from "./types";

export const initialState: BannerState = {
  banners: [],
  bannersError: "",
  bannersLoading: true,
};

const reducer = (state = initialState, action: BannerAction): BannerState => {
  switch (action.type) {
    case BannerActionTypes.FETCH_REQUESTED: {
      const { scope } = action.payload;

      return {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };
    }
    case BannerActionTypes.FETCH_SUCCEEDED: {
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
    case BannerActionTypes.FETCH_FAILED: {
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
