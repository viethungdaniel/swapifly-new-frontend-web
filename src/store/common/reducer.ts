import { HYDRATE } from "next-redux-wrapper";

import { commonHelpers } from "@/utils/helpers";

import { CommonActionTypes } from "./types";

import type { CommonState, CommonAction } from "./types";
import { appStorageService } from "@/services";

export const initialState: CommonState = {
  cookieToken: "",
  cookieTokenError: "",
  cookieTokenLoading: true,

  region: null,
  search: "",
  location: {
    latitude: "",
    longitude: "",
  },

  termsOfServiceAndPrivacyPolicy: {
    privacyPolicy: "",
    termsOfService: "",
  },
  termsOfServiceAndPrivacyPolicyLoading: true,
  termsOfServiceAndPrivacyPolicyError: "",

  settings: {
    search_min_length: 3,
    resend_email_code_time: 300,
    reset_pwd_resend_email_code_time: 300,
    reset_pwd_resend_otp_code_time: 300,
    bind_phone_resend_otp_code_time: 300,
    search_history_max_records: 10,
    desktop_home_banner_resolution_width: 1920,
    desktop_home_banner_resolution_height: 386,
    mobile_home_banner_resolution_width: 960,
    mobile_home_banner_resolution_height: 386,
  },
  settingsError: "",
  settingsLoading: true,

  regions: [],
  regionsLoading: true,
  regionsError: "",
};

const reducer = (state = initialState, action: CommonAction): CommonState => {
  switch (action.type) {
    case CommonActionTypes.FETCH_REQUESTED: {
      const { scope } = action.payload;

      return {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };
    }
    case CommonActionTypes.FETCH_SUCCEEDED: {
      const { scope, count } = action.payload;
      const data = action.payload.data;

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

      switch (scope) {
        case "settings": {
          return {
            ...newState,
            settings: {
              ...state.settings,
              ...(data as CommonState["settings"]),
            },
          };
        }
        default: {
          return newState;
        }
      }
    }

    case CommonActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        [`${scope}Error`]: error,
        [`${scope}Loading`]: false,
      };
    }

    case CommonActionTypes.SET_REGION: {
      appStorageService.saveStorageAuthUserRegion(action.payload);
      appStorageService.saveCookieAuthUserRegionId(action.payload?.id!);

      return {
        ...state,
        region: action.payload,
      };
    }

    case CommonActionTypes.SET_SEARCH: {
      return {
        ...state,
        search: action.payload,
      };
    }

    case CommonActionTypes.SET_LOCATION: {
      const newLocation = {
        ...state.location,
        ...action.payload,
      };
      appStorageService.saveCookieLocation({
        latitude: newLocation.latitude,
        longitude: newLocation.longitude,
      });

      return {
        ...state,
        location: newLocation,
      };
    }

    case HYDRATE as any: {
      const {} = (action as any).payload.common as CommonState;

      return {
        ...state,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
