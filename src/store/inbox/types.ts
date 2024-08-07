import type {
  FetchInboxThreadOfferPayload,
  FetchInboxThreadOfferResponseData,
  FetchInboxThreadMessagesPayload,
  FetchInboxThreadMessagesResponseData,
  FetchInboxThreadsPayload,
  FetchInboxThreadsResponseData,
  FetchUnreadInboxThreadMessageCountPayload,
  UpdateInboxThreadAiChatStatusPayload,
} from "@/utils/apis/inbox";

export enum InboxActionTypes {
  FETCH_REQUESTED = "@@inbox/FETCH_REQUESTED",
  FETCH_SUCCEEDED = "@@inbox/FETCH_SUCCEEDED",
  FETCH_FAILED = "@@inbox/FETCH_FAILED",

  FETCH_INBOX_THREAD_OFFER_SUCCEEDED_SERVER = "@@inbox/FETCH_INBOX_THREAD_OFFER_SUCCEEDED_SERVER",
  DESTROY_SELECTED_INBOX_THREAD_SERVER = "@@inbox/DESTROY_SELECTED_INBOX_THREAD_SERVER",

  MARK_SOLD_PRODUCT_SUCCEEDED = "@@inbox/MARK_SOLD_PRODUCT_SUCCEEDED",
  DELETE_INBOX_THREADS_SUCCEEDED = "@@inbox/DELETE_INBOX_THREADS_SUCCEEDED",

  SET_UNREAD_INBOX_THREAD_MESSAGE_COUNT = "@@inbox/SET_UNREAD_INBOX_THREAD_MESSAGE_COUNT",
  SET_SELECTED_INBOX_THREAD_ID = "@@inbox/SET_SELECTED_INBOX_THREAD_ID",
  SET_SELECTED_INBOX_THREAD_TYPE = "@@inbox/SET_SELECTED_INBOX_THREAD_TYPE",
  UNMARK_INBOX_THREAD_MESSAGE_NEW_MESSAGE = "@@inbox/UNMARK_INBOX_THREAD_MESSAGE_NEW_MESSAGE",
  MARK_INBOX_THREAD_MESSAGE_READ = "@@inbox/MARK_INBOX_THREAD_MESSAGE_READ",

  SUBMIT_INBOX_THREAD_MESSAGE = "@@inbox/SUBMIT_INBOX_THREAD_MESSAGE",
  SUBMIT_INBOX_THREAD_MESSAGE_SUCCEEDED = "@@inbox/SUBMIT_INBOX_THREAD_MESSAGE_SUCCEEDED",
  SUBMIT_INBOX_THREAD_MESSAGE_FAILED = "@@inbox/SUBMIT_INBOX_THREAD_MESSAGE_FAILED",

  CREATE_INBOX_THREAD_OFFER_SUCCEEDED = "@@inbox/CREATE_INBOX_THREAD_OFFER_SUCCEEDED",
  UPDATE_INBOX_THREAD_OFFER_SUCCEEDED = "@@inbox/UPDATE_INBOX_THREAD_OFFER_SUCCEEDED",
  CANCEL_INBOX_THREAD_OFFER_SUCCEEDED = "@@inbox/CANCEL_INBOX_THREAD_OFFER_SUCCEEDED",
  DECLINE_INBOX_THREAD_OFFER_SUCCEEDED = "@@inbox/DECLINE_INBOX_THREAD_OFFER_SUCCEEDED",
  ACCEPT_INBOX_THREAD_OFFER_SUCCEEDED = "@@inbox/ACCEPT_INBOX_THREAD_OFFER_SUCCEEDED",
  SUBMIT_INBOX_THREAD_REVIEWS_SUCCEEDED = "@@inbox/SUBMIT_INBOX_THREAD_REVIEWS_SUCCEEDED",
  UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SUCCEEDED = "@@inbox/UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SUCCEEDED",
  // Saga
  FETCH_UNREAD_INBOX_THREAD_MESSAGE_COUNT_SAGA = "@@inbox/FETCH_UNREAD_INBOX_THREAD_MESSAGE_COUNT_SAGA",
  FETCH_INBOX_THREADS_SAGA = "@@inbox/FETCH_INBOX_THREADS_SAGA",
  FETCH_INBOX_THREAD_MESSAGES_SAGA = "@@inbox/FETCH_INBOX_THREAD_MESSAGES_SAGA",
  FETCH_INBOX_THREAD_OFFER_SAGA = "@@inbox/FETCH_INBOX_THREAD_OFFER_SAGA",
  UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SAGA = "@@inbox/UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SAGA",
}

// State
type InboxThreadOfferActionPayload = {
  content_type: number;
  content: string;
  content_from_type: number;
  created_time: number;
  currency: string;
  inbox_thread_message_id: number;
  inbox_thread_offer_price: number;
  inbox_thread_message_type: number;
  inbox_thread_id: number;
  inbox_thread_latest_type: number;
  user_id: number;
  user_nickname: string;
  user_avatar: string;
  user_type: string;
  is_read: BooleanNumber;
  inbox_thread_offer_product_id: number;
  inbox_thread_offer_product_image: string;
  inbox_thread_offer_product_price: string;
  inbox_thread_offer_product_state: number;
  inbox_thread_offer_product_title: string;
};
export interface InboxState {
  hydrated?: boolean;

  unreadInboxThreadMessageCount: number;

  inboxThreads: FetchInboxThreadsResponseData;
  inboxThreadsLoading: boolean;
  inboxThreadsError: string;
  inboxThreadsCount: number;

  selectedInboxThreadId: number | null;
  selectedInboxThreadType: number | null;

  inboxThreadOffer: (FetchInboxThreadOfferResponseData & {}) | null;
  inboxThreadOfferLoading: boolean;
  inboxThreadOfferError: string;

  inboxThreadMessages: Array<
    FetchInboxThreadMessagesResponseData[number] & {
      fe_id?: string;
      is_sending?: boolean;
      is_error?: boolean;
      is_new_message?: boolean;
    }
  >;
  inboxThreadMessagesLoading: boolean;
  inboxThreadMessagesError: string;
  inboxThreadMessagesCount: number;
}

// ---- Reducer Action ----

export type FetchScope =
  | "inboxThreads"
  | "inboxThreadMessages"
  | "inboxThreadOffer"
  | "unreadInboxThreadMessageCount";

export type FetchRequestedAction = {
  type: InboxActionTypes.FETCH_REQUESTED;
  payload: {
    scope: FetchScope;
    isReset?: boolean;
    loadingDisabled?: boolean;
    params?: any;
  };
};

export type FetchSucceededAction = {
  type: InboxActionTypes.FETCH_SUCCEEDED;
  payload: {
    scope: FetchScope;
    data: InboxState[FetchScope];
    count?: number;
    isLoadMore?: boolean;
    params?: any;
  };
};

export type FetchFailedAction = {
  type: InboxActionTypes.FETCH_FAILED;
  payload: {
    scope: FetchScope;
    error: string;
    params?: any;
  };
};

export type FetchInboxThreadOfferSucceededServerAction = {
  type: InboxActionTypes.FETCH_INBOX_THREAD_OFFER_SUCCEEDED_SERVER;
  payload: {
    inboxThreadOffer: FetchInboxThreadOfferResponseData;
    selectedInboxThreadId: number;
  };
};

export type SetSelectedInboxThreadIdAction = {
  type: InboxActionTypes.SET_SELECTED_INBOX_THREAD_ID;
  payload: number;
};

export type SetSelectedInboxThreadTypeAction = {
  type: InboxActionTypes.SET_SELECTED_INBOX_THREAD_TYPE;
  payload: number;
};

export type SubmitInboxThreadReviewsSucceededAction = {
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_REVIEWS_SUCCEEDED;
  payload: {
    inbox_thread_id: number;
    is_seller: boolean;
  };
};

export type MarkSoldProductSucceededAction = {
  type: InboxActionTypes.MARK_SOLD_PRODUCT_SUCCEEDED;
  payload: {
    id: number;
  };
};

export type SubmitInboxThreadMessageAction = {
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE;
  payload: {
    fe_id: string;
    content: string;
    content_type: number;
    created_time: number;
    user_id: number;
    user_avatar: string;
    user_nickname: string;
  };
};

export type SubmitInboxThreadMessageSucceededAction = {
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE_SUCCEEDED;
  payload: {
    fe_id?: string;
    content_type: number;
    content: string;
    content_from_type: number;
    created_time: number;
    currency: string;
    inbox_thread_message_id: number;
    inbox_thread_offer_price?: number;
    inbox_thread_message_type: number;
    inbox_thread_id: number;
    inbox_thread_latest_type?: number;
    user_id: number;
    user_nickname: string;
    user_avatar: string;
    user_type: string;
    is_read: BooleanNumber;
    inbox_thread_offer_product_id: number;
    inbox_thread_offer_product_image: string;
    inbox_thread_offer_product_price: string;
    inbox_thread_offer_product_state: number;
    inbox_thread_offer_product_title: string;
  };
};

export type SubmitInboxThreadMessageFailedAction = {
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE_FAILED;
  payload: {
    fe_id?: string;
  };
};

export type CreateInboxThreadOfferSucceededAction = {
  type: InboxActionTypes.CREATE_INBOX_THREAD_OFFER_SUCCEEDED;
  payload: InboxThreadOfferActionPayload;
};

export type UpdateInboxThreadOfferSucceededAction = {
  type: InboxActionTypes.UPDATE_INBOX_THREAD_OFFER_SUCCEEDED;
  payload: InboxThreadOfferActionPayload;
};

export type CancelInboxThreadOfferSucceededAction = {
  type: InboxActionTypes.CANCEL_INBOX_THREAD_OFFER_SUCCEEDED;
  payload: InboxThreadOfferActionPayload;
};

export type AcceptInboxThreadOfferSucceededAction = {
  type: InboxActionTypes.ACCEPT_INBOX_THREAD_OFFER_SUCCEEDED;
  payload: InboxThreadOfferActionPayload;
};

export type DeclineInboxThreadOfferSucceededAction = {
  type: InboxActionTypes.DECLINE_INBOX_THREAD_OFFER_SUCCEEDED;
  payload: InboxThreadOfferActionPayload;
};

export type UnmarkInboxThreadMessageNewMessageAction = {
  type: InboxActionTypes.UNMARK_INBOX_THREAD_MESSAGE_NEW_MESSAGE;
  payload: number;
};

export type MarkInboxThreadMessageReadAction = {
  type: InboxActionTypes.MARK_INBOX_THREAD_MESSAGE_READ;
  payload: {
    inboxThreadMessageId: number;
    inboxThreadId: number;
  };
};

export type DeleteInboxThreadSucceededAction = {
  type: InboxActionTypes.DELETE_INBOX_THREADS_SUCCEEDED;
  payload: {
    threadIds: number[];
  };
};

export type DestroySelectedInboxThreadServerAction = {
  type: InboxActionTypes.DESTROY_SELECTED_INBOX_THREAD_SERVER;
};

export type UpdateInboxThreadAiChatStatusSucceededAction = {
  type: InboxActionTypes.UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SUCCEEDED;
  payload: {
    product_id: number;
    status: string;
  };
};

export type SetUnreadInboxThreadMessageCountAction = {
  type: InboxActionTypes.SET_UNREAD_INBOX_THREAD_MESSAGE_COUNT;
  payload: number;
};

// ---- Saga Action ----

export type FetchInboxThreadsSagaAction = {
  type: InboxActionTypes.FETCH_INBOX_THREADS_SAGA;
  payload: FetchInboxThreadsPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    loadingDisabled?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchInboxThreadMessagesSagaAction = {
  type: InboxActionTypes.FETCH_INBOX_THREAD_MESSAGES_SAGA;
  payload: FetchInboxThreadMessagesPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    loadingDisabled?: boolean;
    params?: {
      is_reFetched?: boolean;
    };
    resolve?: (payload?: any) => void;
  };
};

export type FetchInboxThreadOfferSagaAction = {
  type: InboxActionTypes.FETCH_INBOX_THREAD_OFFER_SAGA;
  payload: FetchInboxThreadOfferPayload;
  meta?: {
    isLoadMore?: boolean;
    isReset?: boolean;
    loadingDisabled?: boolean;
    resolve?: (payload?: any) => void;
  };
};

export type FetchUnreadInboxThreadMessageCountSagaAction = {
  type: InboxActionTypes.FETCH_UNREAD_INBOX_THREAD_MESSAGE_COUNT_SAGA;
  payload?: FetchUnreadInboxThreadMessageCountPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type UpdateInboxThreadAiChatStatusSaga = {
  type: InboxActionTypes.UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SAGA;
  payload: UpdateInboxThreadAiChatStatusPayload;
  meta?: {
    resolve?: (payload?: any) => void;
  };
};

export type InboxAction =
  | FetchRequestedAction
  | FetchSucceededAction
  | FetchFailedAction
  | FetchInboxThreadOfferSucceededServerAction
  | SetSelectedInboxThreadIdAction
  | SetSelectedInboxThreadTypeAction
  | SubmitInboxThreadReviewsSucceededAction
  | MarkSoldProductSucceededAction
  | SubmitInboxThreadMessageAction
  | SubmitInboxThreadMessageFailedAction
  | SubmitInboxThreadMessageSucceededAction
  | CreateInboxThreadOfferSucceededAction
  | DeleteInboxThreadSucceededAction
  | UnmarkInboxThreadMessageNewMessageAction
  | UpdateInboxThreadOfferSucceededAction
  | CancelInboxThreadOfferSucceededAction
  | AcceptInboxThreadOfferSucceededAction
  | DeclineInboxThreadOfferSucceededAction
  | MarkInboxThreadMessageReadAction
  | DestroySelectedInboxThreadServerAction
  | UpdateInboxThreadAiChatStatusSucceededAction
  | SetUnreadInboxThreadMessageCountAction
  //
  | FetchUnreadInboxThreadMessageCountSagaAction
  | FetchInboxThreadsSagaAction
  | FetchInboxThreadMessagesSagaAction
  | FetchInboxThreadOfferSagaAction
  | UpdateInboxThreadAiChatStatusSaga;
