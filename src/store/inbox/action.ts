import { InboxActionTypes } from "./types";
import type {
  FetchRequestedAction,
  FetchSucceededAction,
  FetchFailedAction,
  FetchInboxThreadOfferSucceededServerAction,
  SetSelectedInboxThreadIdAction,
  SetSelectedInboxThreadTypeAction,
  SubmitInboxThreadReviewsSucceededAction,
  MarkSoldProductSucceededAction,
  SubmitInboxThreadMessageAction,
  SubmitInboxThreadMessageFailedAction,
  SubmitInboxThreadMessageSucceededAction,
  CreateInboxThreadOfferSucceededAction,
  DeleteInboxThreadSucceededAction,
  UnmarkInboxThreadMessageNewMessageAction,
  UpdateInboxThreadOfferSucceededAction,
  CancelInboxThreadOfferSucceededAction,
  AcceptInboxThreadOfferSucceededAction,
  DeclineInboxThreadOfferSucceededAction,
  MarkInboxThreadMessageReadAction,
  DestroySelectedInboxThreadServerAction,
  UpdateInboxThreadAiChatStatusSucceededAction,
  SetUnreadInboxThreadMessageCountAction,
  // Saga
  FetchInboxThreadsSagaAction,
  FetchInboxThreadOfferSagaAction,
  FetchInboxThreadMessagesSagaAction,
  FetchUnreadInboxThreadMessageCountSagaAction,
  UpdateInboxThreadAiChatStatusSaga,
} from "./types";

// ---- REDUCER ACTION ----

export const fetchRequested = (
  payload: FetchRequestedAction["payload"]
): FetchRequestedAction => ({
  type: InboxActionTypes.FETCH_REQUESTED,
  payload,
});

export const fetchSucceeded = (
  payload: FetchSucceededAction["payload"]
): FetchSucceededAction => ({
  type: InboxActionTypes.FETCH_SUCCEEDED,
  payload,
});

export const fetchFailed = (
  payload: FetchFailedAction["payload"]
): FetchFailedAction => ({
  type: InboxActionTypes.FETCH_FAILED,
  payload,
});

export const fetchInboxThreadOfferSucceededServer = (
  payload: FetchInboxThreadOfferSucceededServerAction["payload"]
): FetchInboxThreadOfferSucceededServerAction => ({
  type: InboxActionTypes.FETCH_INBOX_THREAD_OFFER_SUCCEEDED_SERVER,
  payload,
});

export const setSelectedInboxThreadId = (
  payload: SetSelectedInboxThreadIdAction["payload"]
): SetSelectedInboxThreadIdAction => ({
  type: InboxActionTypes.SET_SELECTED_INBOX_THREAD_ID,
  payload,
});

export const setSelectedInboxThreadType = (
  payload: SetSelectedInboxThreadTypeAction["payload"]
): SetSelectedInboxThreadTypeAction => ({
  type: InboxActionTypes.SET_SELECTED_INBOX_THREAD_TYPE,
  payload,
});

export const submitInboxReviewsSucceeded = (
  payload: SubmitInboxThreadReviewsSucceededAction["payload"]
): SubmitInboxThreadReviewsSucceededAction => ({
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_REVIEWS_SUCCEEDED,
  payload,
});

export const markSoldProductSucceeded = (
  payload: MarkSoldProductSucceededAction["payload"]
): MarkSoldProductSucceededAction => ({
  type: InboxActionTypes.MARK_SOLD_PRODUCT_SUCCEEDED,
  payload,
});

export const submitInboxThreadMessage = (
  payload: SubmitInboxThreadMessageAction["payload"]
): SubmitInboxThreadMessageAction => ({
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE,
  payload,
});

export const submitInboxThreadMessageSucceeded = (
  payload: SubmitInboxThreadMessageSucceededAction["payload"]
): SubmitInboxThreadMessageSucceededAction => ({
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE_SUCCEEDED,
  payload,
});

export const submitInboxThreadMessageFailed = (
  payload: SubmitInboxThreadMessageFailedAction["payload"]
): SubmitInboxThreadMessageFailedAction => ({
  type: InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE_FAILED,
  payload,
});

export const createInboxThreadOfferSucceeded = (
  payload: CreateInboxThreadOfferSucceededAction["payload"]
): CreateInboxThreadOfferSucceededAction => ({
  type: InboxActionTypes.CREATE_INBOX_THREAD_OFFER_SUCCEEDED,
  payload,
});

export const deleteInboxThreadSucceeded = (
  payload: DeleteInboxThreadSucceededAction["payload"]
): DeleteInboxThreadSucceededAction => ({
  type: InboxActionTypes.DELETE_INBOX_THREADS_SUCCEEDED,
  payload,
});

export const unmarkInboxThreadMessageNewMessage = (
  payload: UnmarkInboxThreadMessageNewMessageAction["payload"]
): UnmarkInboxThreadMessageNewMessageAction => ({
  type: InboxActionTypes.UNMARK_INBOX_THREAD_MESSAGE_NEW_MESSAGE,
  payload,
});

export const updateInboxThreadOfferSucceeded = (
  payload: UpdateInboxThreadOfferSucceededAction["payload"]
): UpdateInboxThreadOfferSucceededAction => ({
  type: InboxActionTypes.UPDATE_INBOX_THREAD_OFFER_SUCCEEDED,
  payload,
});

export const cancelInboxThreadOfferSucceeded = (
  payload: CancelInboxThreadOfferSucceededAction["payload"]
): CancelInboxThreadOfferSucceededAction => ({
  type: InboxActionTypes.CANCEL_INBOX_THREAD_OFFER_SUCCEEDED,
  payload,
});

export const acceptInboxThreadOfferSucceeded = (
  payload: AcceptInboxThreadOfferSucceededAction["payload"]
): AcceptInboxThreadOfferSucceededAction => ({
  type: InboxActionTypes.ACCEPT_INBOX_THREAD_OFFER_SUCCEEDED,
  payload,
});

export const declineInboxThreadOfferSucceeded = (
  payload: DeclineInboxThreadOfferSucceededAction["payload"]
): DeclineInboxThreadOfferSucceededAction => ({
  type: InboxActionTypes.DECLINE_INBOX_THREAD_OFFER_SUCCEEDED,
  payload,
});

export const markInboxThreadMessageRead = (
  payload: MarkInboxThreadMessageReadAction["payload"]
): MarkInboxThreadMessageReadAction => ({
  type: InboxActionTypes.MARK_INBOX_THREAD_MESSAGE_READ,
  payload,
});

export const destroySelectedInboxThreadServer =
  (): DestroySelectedInboxThreadServerAction => ({
    type: InboxActionTypes.DESTROY_SELECTED_INBOX_THREAD_SERVER,
  });

export const updateInboxThreadAiChatStatusSucceeded = (
  payload: UpdateInboxThreadAiChatStatusSucceededAction["payload"]
): UpdateInboxThreadAiChatStatusSucceededAction => ({
  type: InboxActionTypes.UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SUCCEEDED,
  payload,
});

export const setUnreadInboxThreadMessageCount = (
  payload: SetUnreadInboxThreadMessageCountAction["payload"]
): SetUnreadInboxThreadMessageCountAction => ({
  type: InboxActionTypes.SET_UNREAD_INBOX_THREAD_MESSAGE_COUNT,
  payload,
});

// ---- SAGA ACTION ----

export const fetchInboxThreadsSaga = (
  payload: FetchInboxThreadsSagaAction["payload"],
  meta?: FetchInboxThreadsSagaAction["meta"]
): FetchInboxThreadsSagaAction => ({
  type: InboxActionTypes.FETCH_INBOX_THREADS_SAGA,
  payload,
  meta,
});

export const fetchInboxThreadMessagesSaga = (
  payload: FetchInboxThreadMessagesSagaAction["payload"],
  meta?: FetchInboxThreadMessagesSagaAction["meta"]
): FetchInboxThreadMessagesSagaAction => ({
  type: InboxActionTypes.FETCH_INBOX_THREAD_MESSAGES_SAGA,
  payload,
  meta,
});

export const fetchInboxThreadOfferSaga = (
  payload: FetchInboxThreadOfferSagaAction["payload"],
  meta?: FetchInboxThreadOfferSagaAction["meta"]
): FetchInboxThreadOfferSagaAction => ({
  type: InboxActionTypes.FETCH_INBOX_THREAD_OFFER_SAGA,
  payload,
  meta,
});

export const fetchUnreadInboxThreadMessageCountSaga = (
  payload?: FetchUnreadInboxThreadMessageCountSagaAction["payload"],
  meta?: FetchUnreadInboxThreadMessageCountSagaAction["meta"]
): FetchUnreadInboxThreadMessageCountSagaAction => ({
  type: InboxActionTypes.FETCH_UNREAD_INBOX_THREAD_MESSAGE_COUNT_SAGA,
  payload,
  meta,
});

export const updateInboxThreadAiChatStatus = (
  payload: UpdateInboxThreadAiChatStatusSaga["payload"],
  meta?: UpdateInboxThreadAiChatStatusSaga["meta"]
): UpdateInboxThreadAiChatStatusSaga => ({
  type: InboxActionTypes.UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SAGA,
  payload,
  meta,
});
