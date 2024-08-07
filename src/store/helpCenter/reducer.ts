import { HYDRATE } from "next-redux-wrapper";

import { HelpCenterActionTypes } from "./types";

import { commonHelpers } from "@/utils/helpers";

import type { HelpCenterState, HelpCenterAction } from "./types";

export const initialState: HelpCenterState = {
  helpCenters: [],
  helpCentersError: "",
  helpCentersLoading: true,
  helpCentersCount: 0,

  helpCentersItem: null,
  helpCentersItemError: "",
  helpCentersItemLoading: true,

  helpCenter: null,
  helpCenterError: "",
  helpCenterLoading: true,
};

const reducer = (
  state = initialState,
  action: HelpCenterAction
): HelpCenterState => {
  switch (action.type) {
    case HYDRATE as any: {
      const { helpCenter, helpCenterError, helpCenterLoading, hydrated } = (
        action as any
      ).payload.helpCenter as HelpCenterState;

      const newState = {
        helpCenter,
        helpCenterError,
        helpCenterLoading,
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

    case HelpCenterActionTypes.FETCH_REQUESTED: {
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
    case HelpCenterActionTypes.FETCH_SUCCEEDED: {
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
    case HelpCenterActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        [`${scope}Error`]: error,
        [`${scope}Loading`]: false,
      };
    }
    case HelpCenterActionTypes.FETCH_HELP_CENTER_SUCCEEDED_SERVER: {
      return {
        helpCenter: action.payload,
        helpCenterError: "",
        helpCenterLoading: false,
        hydrated: true,
      } as Partial<HelpCenterState> as HelpCenterState;
    }
    default: {
      return state;
    }
  }
};

export default reducer;
