import { UserActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";
import { HYDRATE } from "next-redux-wrapper";

import type { UserState, UserAction } from "./types";

export const initialState: UserState = {
  users: [],
  usersError: "",
  usersLoading: true,
  usersCount: 0,

  inboxThreadOfferProductAiChatUsers: [],
  inboxThreadOfferProductAiChatUsersError: "",
  inboxThreadOfferProductAiChatUsersLoading: false,
  inboxThreadOfferProductAiChatUsersCount: 0,

  user: null,
  userError: "",
  userLoading: true,
};

const reducer = (state = initialState, action: UserAction): UserState => {
  switch (action.type) {
    case HYDRATE as any: {
      const { user, userError, userLoading, hydrated } = (action as any).payload
        .user as UserState;

      const newState = {
        user,
        userError,
        userLoading,
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

    case UserActionTypes.FETCH_REQUESTED: {
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
    case UserActionTypes.FETCH_SUCCEEDED: {
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
    case UserActionTypes.FETCH_FAILED: {
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

    case UserActionTypes.FETCH_USER_SUCCEEDED_SERVER: {
      return {
        user: action.payload,
        userLoading: false,
        userError: "",
        hydrated: true,
      } as Partial<UserState> as UserState;
    }

    case UserActionTypes.SET_ALL_USER_FOLLOW: {
      const { id, followed } = action.payload;

      const newUsers = state.users.map((user) => {
        if (user.id === id) {
          const newFollowerCount =
            (user.follower_count ?? 0) + (followed ? 1 : -1);
          return {
            ...user,
            isfollow: !!followed,
            follower_count: newFollowerCount >= 0 ? newFollowerCount : 0,
          };
        }
        return user;
      });

      const newUserFollowerCount =
        (state.user?.shop?.followers ?? 0) + (followed ? 1 : -1);
      const newUser: UserState["user"] = !!state.user
        ? {
            ...state.user,
            shop: {
              ...state.user?.shop,
              isfollow: followed ? (1 as const) : (0 as const),
              followers: newUserFollowerCount >= 0 ? newUserFollowerCount : 0,
            },
          }
        : null;

      return {
        ...state,
        users: newUsers,
        user: newUser,
      };
    }

    case UserActionTypes.SET_ALL_USER_BANNER: {
      const { id, banner } = action.payload;

      const newUser: UserState["user"] = !!state.user
        ? {
            ...state.user,
            shop: {
              ...state.user?.shop,
              ...(id === state.user.shop?.id
                ? {
                    banner: banner,
                    banner_mobile: banner,
                  }
                : {}),
            },
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
