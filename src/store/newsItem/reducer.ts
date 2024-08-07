import { HYDRATE } from "next-redux-wrapper";

import { NewsItemActionTypes } from "./types";

import { commonHelpers } from "@/utils/helpers";

import type { NewsItemState, NewsItemAction } from "./types";

export const initialState: NewsItemState = {
  newsItems: [],
  newsItemsError: "",
  newsItemsLoading: true,
  newsItemsCount: 0,

  recentNewsItems: [],
  recentNewsItemsError: "",
  recentNewsItemsLoading: true,

  newsItem: null,
  newsItemError: "",
  newsItemLoading: true,
};

const reducer = (
  state = initialState,
  action: NewsItemAction
): NewsItemState => {
  switch (action.type) {
    case HYDRATE as any: {
      const { newsItem, newsItemError, newsItemLoading, hydrated } = (
        action as any
      ).payload.newsItem as NewsItemState;

      const newState = {
        newsItem,
        newsItemError,
        newsItemLoading,
      };

      if (typeof hydrated !== "undefined") {
        Object.entries(newState).forEach(([key, _state]) => {
          if (typeof _state === "undefined") delete (newState as any)[key];
        });
      }

      return {
        ...state,
        ...(typeof hydrated !== "undefined" ? newState : {}),
        hydrated: true,
      };
    }

    case NewsItemActionTypes.FETCH_REQUESTED: {
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
    case NewsItemActionTypes.FETCH_SUCCEEDED: {
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
    case NewsItemActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        [`${scope}Error`]: error,
        [`${scope}Loading`]: false,
      };
    }

    case NewsItemActionTypes.FETCH_NEWS_ITEM_SUCCEEDED_SERVER: {
      return {
        newsItem: action.payload,
        newsItemError: "",
        newsItemLoading: false,
        hydrated: true,
      } as Partial<NewsItemState> as NewsItemState;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
