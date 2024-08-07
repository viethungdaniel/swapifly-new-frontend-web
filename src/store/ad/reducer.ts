import { AdActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { AdState, AdAction } from "./types";

export const initialState: AdState = {
  bannersAds: [],
  bannersAdsError: "",
  bannersAdsLoading: false,

  inboxThreadsAds: [],
  inboxThreadsAdsError: "",
  inboxThreadsAdsLoading: false,

  popupAd: null,
  popupAdError: "",
  popupAdLoading: false,

  productAd: null,
  productAdError: "",
  productAdLoading: false,

  productsRectangleAds: [],
  productsRectangleAdsError: "",
  productsRectangleAdsLoading: false,

  productsSquareAds: [],
  productsSquareAdsError: "",
  productsSquareAdsLoading: false,

  recommendedHomeProductsSquareAds: [],
  recommendedHomeProductsSquareAdsError: "",
  recommendedHomeProductsSquareAdsLoading: false,
};

const reducer = (state = initialState, action: AdAction): AdState => {
  switch (action.type) {
    case AdActionTypes.FETCH_REQUESTED: {
      const { scope, isReset, loadingDisabled } = action.payload;

      const newState = {
        ...state,
        ...(typeof state[`${scope}Error` as keyof typeof state] !== "undefined"
          ? {
              [`${scope}Error`]: "",
            }
          : {}),
      };

      if (
        !loadingDisabled &&
        typeof newState[`${scope}Loading` as keyof typeof newState] !==
          "undefined"
      ) {
        Object.assign(newState, {
          [`${scope}Loading`]: true,
        });
      }

      if (isReset) {
        Object.assign(newState, {
          [scope]: Array.isArray(newState[scope]) ? [] : null,
          ...(typeof state[`${scope}Count` as keyof typeof state] !==
          "undefined"
            ? {
                [`${scope}Count`]: 0,
              }
            : {}),
        });
      }

      return newState;
    }
    case AdActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count, isLoadMore } = action.payload;

      const stateData = state[scope];
      let newData = data;

      if (isLoadMore && Array.isArray(stateData) && Array.isArray(data)) {
        const filteredData = data.filter((item) => {
          return stateData.every(
            (stateDataItem) => item.id !== stateDataItem.id
          );
        });
        newData = [...stateData, ...filteredData] as typeof data;
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
        ...(commonHelpers.isNumber(count) &&
        typeof state[`${scope}Count` as keyof typeof state] !== "undefined"
          ? {
              [`${scope}Count`]: count,
            }
          : {}),
      };
    }
    case AdActionTypes.FETCH_FAILED: {
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
