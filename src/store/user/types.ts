import type {
  FetchInboxThreadOfferProductAiChatUsersPayload,
  FetchInboxThreadOfferProductAiChatUsersResponseData,
  FetchUserPayload,
  FetchUserResponseData,
  FetchUsersPayload,
  FetchUsersResponseData,
  FollowUserPayload,
} from "@/utils/apis/user";

export enum UserActionTypes {
  FETCH_REQUESTED = "@@user/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@user/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@user/FETCH_FAILED",

  FETCH_USER_SUCCEEDED_SERVER = "@@user/FETCH_USER_SUCCEEDED_SERVER",

  SET_ALL_USER_FOLLOW = "@@user/SET_ALL_USER_FOLLOW",

  SET_ALL_USER_BANNER = "@@user/SET_ALL_USER_BANNER",

  // Saga
  FETCH_USERS_SAGA = "@@user/FETCH_USERS_SAGA",
  FETCH_USER_SAGA = "@@user/FETCH_USER_SAGA",
  FOLLOW_USER_SAGA = "@@user/FOLLOW_USER_SAGA",
  FETCH_INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_SAGA = "@@user/FETCH_INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_SAGA",
}

// State

export interface UserState {
  hydrated?: boolean;

  users: FetchUsersResponseData["data"];
  usersLoading: boolean;
  usersError: string;
  usersCount: number;

  inboxThreadOfferProductAiChatUsers: FetchInboxThreadOfferProductAiChatUsersResponseData["data"];
  inboxThreadOfferProductAiChatUsersLoading: boolean;
  inboxThreadOfferProductAiChatUsersError: string;
  inboxThreadOfferProductAiChatUsersCount: number;

  user: FetchUserResponseData | null;
  userLoading: boolean;
  userError: string;
}

// ---- Reducer Action ----

export type FetchScope =
  | "users"
  | "user"
  | "inboxThreadOfferProductAiChatUsers";

export type FetchRequestedAction = {
  type: UserActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
  };
};

export type FetchSucceededAction = {
  type: UserActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: UserState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
  };
};

export type FetchFailedAction = {
  type: UserActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
  };
};

export type FetchUserSucceededServerAction = {
  type: UserActionTypes.FETCH_USER_SUCCEEDED_SERVER;
  payload: FetchUserResponseData;
};

export type SetAllUserFollowAction = {
  type: UserActionTypes.SET_ALL_USER_FOLLOW;
  payload: {
    id: number;
    followed: boolean;
  };
};

export type SetAllUserBannerAction = {
  type: UserActionTypes.SET_ALL_USER_BANNER;
  payload: {
    id: number;
    banner: string;
  };
};

// ---- Saga Action ----

export type FetchUsersSagaAction = {
  type: UserActionTypes.FETCH_USERS_SAGA;
  payload?: FetchUsersPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchUserSagaAction = {
  type: UserActionTypes.FETCH_USER_SAGA;
  payload: FetchUserPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FollowUserSagaAction = {
  type: UserActionTypes.FOLLOW_USER_SAGA;
  payload: FollowUserPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type FetchInboxThreadOfferProductAiChatUsersSagaAction = {
  type: UserActionTypes.FETCH_INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_SAGA;
  payload: FetchInboxThreadOfferProductAiChatUsersPayload;
  meta?: {
    resolve?: (payload?: any) => void;
    isLoadMore?: boolean;
    isReset?: boolean;
  };
};

export type UserAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | FetchUserSucceededServerAction
  | SetAllUserFollowAction
  | SetAllUserBannerAction
  //
  | FetchUsersSagaAction
  | FetchUserSagaAction
  | FollowUserSagaAction
  | FetchInboxThreadOfferProductAiChatUsersSagaAction;
