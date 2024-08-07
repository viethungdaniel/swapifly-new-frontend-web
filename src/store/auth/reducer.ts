import { AuthActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";

import type { AuthState, AuthAction } from "./types";

export const initialState: AuthState = {
  user: null,
  userAuthChecking: true,
  userAuthCheckingError: "",
  userLoading: false,
  userError: "",
  isUserAuthExpiredToken: false,

  userLabels: [],
  userLabelsError: "",
  userLabelsLoading: true,

  userLoginInfo: null,
  userLoginInfoError: "",
  userLoginInfoLoading: true,

  userShop: null,
  userShopError: "",
  userShopLoading: true,
};

const reducer = (state = initialState, action: AuthAction): AuthState => {
  switch (action.type) {
    case AuthActionTypes.FETCH_REQUESTED: {
      const { scope } = action.payload;

      return {
        ...state,
        [`${scope}Loading`]: true,
        [`${scope}Error`]: "",
      };
    }
    case AuthActionTypes.FETCH_SUCCEEDED: {
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
    case AuthActionTypes.FETCH_FAILED: {
      const { scope, error } = action.payload;

      return {
        ...state,
        [`${scope}Error`]: error,
        [`${scope}Loading`]: false,
      };
    }

    case AuthActionTypes.CHECK_AUTH_REQUESTED: {
      return {
        ...state,
        isUserAuthExpiredToken: false,
        userAuthChecking: true,
        userAuthCheckingError: "",
      };
    }
    case AuthActionTypes.CHECK_AUTH_SUCCEEDED: {
      return {
        ...state,
        user: {
          ...action.payload,
        } as AuthState["user"],
        userAuthChecking: false,
        isUserAuthExpiredToken: false,
      };
    }
    case AuthActionTypes.CHECK_AUTH_FAILED: {
      const { message, isNetworkError } = action.payload;

      return {
        ...state,
        user: isNetworkError ? state.user : null,
        userAuthCheckingError: message,
        userAuthChecking: false,
        isUserAuthExpiredToken: false,
        // !!isNetworkError,
      };
    }

    case AuthActionTypes.SIGN_IN_SUCCEEDED: {
      return {
        ...state,
        user: action.payload,
      };
    }

    case AuthActionTypes.SIGN_OUT_SUCCEEDED: {
      const { reason } = action?.payload || {};

      return {
        ...state,
        isUserAuthExpiredToken: reason === "EXPIRED_TOKEN",
        user: null,
        userAuthChecking: false,
        userAuthCheckingError: "",
        userLabels: [],
        userLoginInfo: null,
        userShop: null,
      };
    }

    case AuthActionTypes.UPDATE_USER_LABEL_SUCCEEDED: {
      const labelIds = action.payload;
      const newUserLabels = state.userLabels.map((userLabel) => {
        if (!labelIds.includes(userLabel.id)) {
          return userLabel;
        }
        const type: BooleanNumber = labelIds.includes(userLabel.id) ? 1 : 0;
        return {
          ...userLabel,
          type,
        };
      });

      return {
        ...state,
        userLabels: newUserLabels,
      };
    }

    case AuthActionTypes.SET_USER_LOGIN_INFO_MEDIAL_SOCIAL_BINDING_STATE: {
      const { mediaSocial, value } = action.payload;

      if (!!state.userLoginInfo) {
        switch (mediaSocial) {
          case "facebook": {
            const loginMethodCount =
              (state.userLoginInfo.count_login_methods ?? 0) +
              (!!value === !!state.userLoginInfo.login_facebook
                ? 0
                : !!value
                ? 1
                : -1);
            return {
              ...state,
              userLoginInfo: {
                ...state.userLoginInfo,
                count_login_methods:
                  loginMethodCount <= 0 ? 0 : loginMethodCount,
                login_facebook: !!value,
              },
            };
          }
          case "apple": {
            const loginMethodCount =
              (state.userLoginInfo.count_login_methods ?? 0) +
              (!!value === !!state.userLoginInfo.login_apple
                ? 0
                : !!value
                ? 1
                : -1);

            return {
              ...state,
              userLoginInfo: {
                ...state.userLoginInfo,
                count_login_methods:
                  loginMethodCount <= 0 ? 0 : loginMethodCount,
                login_apple: !!value,
              },
            };
          }
          case "wechat": {
            const loginMethodCount =
              (state.userLoginInfo.count_login_methods ?? 0) +
              (!!value === !!state.userLoginInfo.login_wechat
                ? 0
                : !!value
                ? 1
                : -1);

            return {
              ...state,
              userLoginInfo: {
                ...state.userLoginInfo,
                count_login_methods:
                  loginMethodCount <= 0 ? 0 : loginMethodCount,
                login_wechat: !!value,
              },
            };
          }
          case "google": {
            const loginMethodCount =
              (state.userLoginInfo.count_login_methods ?? 0) +
              (!!value === !!state.userLoginInfo.login_google
                ? 0
                : !!value
                ? 1
                : -1);

            return {
              ...state,
              userLoginInfo: {
                ...state.userLoginInfo,
                count_login_methods:
                  loginMethodCount <= 0 ? 0 : loginMethodCount,
                login_google: !!value,
              },
            };
          }
        }
      }

      return {
        ...state,
      };
    }

    case AuthActionTypes.UPDATE_USER: {
      const newUser: AuthState["user"] = !!state.user?.id
        ? {
            ...state.user,
            ...action.payload,
          }
        : null;

      return {
        ...state,
        user: newUser,
      };
    }

    case AuthActionTypes.BIND_EMAIL_SUCCEEDED: {
      const { email } = action.payload;

      const newUser: AuthState["user"] = !!state.user?.id
        ? {
            ...state.user,
            email,
          }
        : null;

      return {
        ...state,
        user: newUser,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
