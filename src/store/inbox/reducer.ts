import { HYDRATE } from "next-redux-wrapper";

import { InboxActionTypes } from "./types";
import { commonHelpers } from "@/utils/helpers";
import { inboxConstants, productConstants } from "@/utils/constants";

import type {
  InboxState,
  InboxAction,
  FetchInboxThreadMessagesSagaAction,
} from "./types";

export const initialState: InboxState = {
  unreadInboxThreadMessageCount: 0,

  inboxThreads: [],
  inboxThreadsError: "",
  inboxThreadsLoading: false,
  inboxThreadsCount: 0,

  selectedInboxThreadId: null,
  selectedInboxThreadType: inboxConstants.INBOX_THREAD_ALL_TYPE,

  inboxThreadOffer: null,
  inboxThreadOfferError: "",
  inboxThreadOfferLoading: true,

  inboxThreadMessages: [],
  inboxThreadMessagesCount: 0,
  inboxThreadMessagesError: "",
  inboxThreadMessagesLoading: true,
};

const reducer = (state = initialState, action: InboxAction): InboxState => {
  switch (action.type) {
    case HYDRATE as any: {
      const {
        selectedInboxThreadId,
        inboxThreadOffer,
        inboxThreadOfferLoading,
        inboxThreadOfferError,
        inboxThreadMessages,
        inboxThreadMessagesError,
        inboxThreadMessagesLoading,
        hydrated,
      } = (action as any).payload.inbox as InboxState;

      const newState = {
        selectedInboxThreadId,
        inboxThreadOffer,
        inboxThreadOfferLoading,
        inboxThreadOfferError,
        inboxThreadMessages,
        inboxThreadMessagesError,
        inboxThreadMessagesLoading,
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

    case InboxActionTypes.DESTROY_SELECTED_INBOX_THREAD_SERVER: {
      return {
        ...state,
        inboxThreadMessages: [],
        inboxThreadMessagesCount: 0,
        inboxThreadMessagesLoading: false,
        inboxThreadMessagesError: "",
        inboxThreadOffer: null,
        inboxThreadOfferError: "",
        inboxThreadOfferLoading: false,
        selectedInboxThreadId: null,
        hydrated: true,
      };
    }

    case InboxActionTypes.FETCH_REQUESTED: {
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
    case InboxActionTypes.FETCH_SUCCEEDED: {
      const { scope, data, count, isLoadMore } = action.payload;

      switch (scope) {
        case "inboxThreadMessages": {
          const metaParams = action.payload.params as NonNullable<
            FetchInboxThreadMessagesSagaAction["meta"]
          >["params"];
          const stateData = state.inboxThreadMessages;
          // let newData = [
          //   ...[...(data as InboxState["inboxThreadMessages"])].reverse(),
          //   ...state.inboxThreadMessages,
          // ];
          const inboxThreadMessagesData =
            data as InboxState["inboxThreadMessages"];
          let newData = inboxThreadMessagesData.reverse().map((d, dIndex) => ({
            ...d,
            is_new_message:
              !!metaParams?.is_reFetched &&
              dIndex === inboxThreadMessagesData.length - 1,
          })) as InboxState["inboxThreadMessages"];

          if (isLoadMore && Array.isArray(stateData) && Array.isArray(data)) {
            const filteredData = newData.filter((item) => {
              return stateData.every(
                (stateDataItem) => item.id !== stateDataItem.id
              );
            });
            newData = [
              ...filteredData,
              ...stateData,
            ] as unknown as InboxState["inboxThreadMessages"];
          }

          return {
            ...state,
            inboxThreadMessages: newData,
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
        default: {
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
            ...(commonHelpers.isNumber(count)
              ? {
                  [`${scope}Count`]: count,
                }
              : {}),
          };
        }
      }
    }
    case InboxActionTypes.FETCH_FAILED: {
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
    case InboxActionTypes.FETCH_INBOX_THREAD_OFFER_SUCCEEDED_SERVER: {
      const { inboxThreadOffer, selectedInboxThreadId } = action.payload;
      return {
        selectedInboxThreadId,
        inboxThreadOffer,
        inboxThreadOfferError: "",
        inboxThreadOfferLoading: false,
        hydrated: true,
      } as Partial<InboxState> as InboxState;
    }

    case InboxActionTypes.SUBMIT_INBOX_THREAD_REVIEWS_SUCCEEDED: {
      const { inbox_thread_id, is_seller } = action.payload;

      return {
        ...state,
        inboxThreadOffer:
          !!state.inboxThreadOffer &&
          state.selectedInboxThreadId === inbox_thread_id
            ? {
                ...state.inboxThreadOffer,
                ...(!!is_seller
                  ? {
                      s_review: 1,
                    }
                  : {
                      b_review: 1,
                    }),
              }
            : state.inboxThreadOffer,
      };
    }
    case InboxActionTypes.SET_SELECTED_INBOX_THREAD_ID: {
      return {
        ...state,
        selectedInboxThreadId: action.payload,
      };
    }
    case InboxActionTypes.SET_SELECTED_INBOX_THREAD_TYPE: {
      return {
        ...state,
        selectedInboxThreadType: action.payload,
      };
    }
    case InboxActionTypes.MARK_SOLD_PRODUCT_SUCCEEDED: {
      const { id } = action.payload;

      const newInboxThreads = state.inboxThreads.map((inbox) => {
        if (inbox.pid === id) {
          return {
            ...inbox,
            p_state: productConstants.SOLD_STATE_NUMBER,
          };
        }
        return inbox;
      });

      return {
        ...state,
        inboxThreads: newInboxThreads,
        inboxThreadOffer:
          !!state.inboxThreadOffer && state.inboxThreadOffer?.product_id === id
            ? {
                ...state.inboxThreadOffer,
                product_state: productConstants.SOLD_STATE_NUMBER,
              }
            : state.inboxThreadOffer,
      };
    }

    case InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE: {
      const payload = action.payload;
      const user = {
        id: payload.user_id,
        nickname: payload.user_nickname,
        avatar: payload.user_nickname,
      };
      const newInboxThreadMessages = [
        ...state.inboxThreadMessages,
        {
          fe_id: payload.fe_id,
          content: action.payload.content,
          from_type: inboxConstants.INBOX_THREAD_MESSAGE_NORMAL_FROM_TYPE,
          type: inboxConstants.INBOX_THREAD_NORMAL_MESSAGE_TYPE,
          uid: user.id,
          create_time: action.payload.created_time,
          c_type: payload.content_type,
          is_error: false,
          is_sending: true,
          isread: 0,
        },
      ] as InboxState["inboxThreadMessages"];

      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === state.selectedInboxThreadId
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      }

      return {
        ...state,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE_SUCCEEDED: {
      const payload = action.payload;
      const updatedInboxThreadMessageIndex =
        state.inboxThreadMessages.findIndex(
          (inboxThreadMessage) =>
            (payload.fe_id && inboxThreadMessage.fe_id === payload.fe_id) ||
            inboxThreadMessage.id === payload.inbox_thread_message_id
        );
      let newInboxThreadMessages = state.inboxThreadMessages;
      if (payload.inbox_thread_id === state.selectedInboxThreadId) {
        if (updatedInboxThreadMessageIndex > -1) {
          newInboxThreadMessages = state.inboxThreadMessages.map(
            (inboxThreadMessage, inboxThreadMessageIndex) => {
              if (inboxThreadMessageIndex === updatedInboxThreadMessageIndex) {
                return {
                  ...inboxThreadMessage,
                  isread: payload.is_read,
                  is_sending: false,
                };
              }
              return inboxThreadMessage;
            }
          );
        } else {
          newInboxThreadMessages = [
            ...state.inboxThreadMessages,
            {
              c_type: payload.content_type,
              content: payload.content,
              create_time: payload.created_time,
              currency: payload.currency,
              from_type: payload.content_from_type,
              id: payload.inbox_thread_message_id,
              price: payload.inbox_thread_offer_price ?? 0,
              type: payload.inbox_thread_message_type,
              uid: payload.user_id,
              block: 0,
              is_new_message: true,
              isread: payload.is_read,
            },
          ];
        }
      }

      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === payload.inbox_thread_id
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          latest_time: payload.created_time,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      } else {
        newInboxThreads = [
          {
            avatar: payload.user_avatar,
            currency: payload.currency,
            id: payload.inbox_thread_id,
            latest_time: payload.created_time,
            latest_type:
              payload.inbox_thread_latest_type ??
              inboxConstants.INBOX_THREAD_NORMAL_MESSAGE_TYPE,
            new_text: {
              c_type: payload.content_type,
              content: payload.content,
              isread: payload.is_read,
            },
            nickname: payload.user_nickname,
            p_image: payload.inbox_thread_offer_product_image,
            p_price: payload.inbox_thread_offer_product_price,
            p_state: payload.inbox_thread_offer_product_state,
            p_title: payload.inbox_thread_offer_product_title,
            pid: payload.inbox_thread_offer_product_id,
            price: payload.inbox_thread_offer_price ?? 0,
            user_type: payload.user_type,
          },
          ...state.inboxThreads,
        ];
      }

      return {
        ...state,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.SUBMIT_INBOX_THREAD_MESSAGE_FAILED: {
      const payload = action.payload;
      const updatedInboxThreadMessageIndex =
        state.inboxThreadMessages.findIndex(
          (inboxThreadMessage) => inboxThreadMessage.fe_id === payload.fe_id
        );
      let newInboxThreadMessages = [...state.inboxThreadMessages];
      if (updatedInboxThreadMessageIndex > -1) {
        newInboxThreadMessages = state.inboxThreadMessages.map(
          (inboxThreadMessage, inboxThreadMessageIndex) => {
            if (inboxThreadMessageIndex === updatedInboxThreadMessageIndex) {
              return {
                ...inboxThreadMessage,
                is_sending: false,
                is_error: true,
              };
            }
            return inboxThreadMessage;
          }
        );
      }
      return {
        ...state,
        inboxThreadMessages: newInboxThreadMessages,
      };
    }

    case InboxActionTypes.CREATE_INBOX_THREAD_OFFER_SUCCEEDED: {
      const payload = action.payload;

      const newInboxThreadOffer =
        payload.inbox_thread_id !== state.selectedInboxThreadId
          ? state.inboxThreadOffer
          : ({
              ...state.inboxThreadOffer,
              offer_status:
                inboxConstants.INBOX_THREAD_OFFER_CREATED_OFFER_STATUS,
              offer_price_origin: payload.inbox_thread_offer_price,
            } as InboxState["inboxThreadOffer"]);
      let newInboxThreadMessages = state.inboxThreadMessages;
      if (payload.inbox_thread_id === state.selectedInboxThreadId) {
        newInboxThreadMessages = [
          ...state.inboxThreadMessages,
          {
            c_type: payload.content_type,
            content: payload.content,
            create_time: payload.created_time,
            currency: payload.currency,
            from_type: payload.content_from_type,
            id: payload.inbox_thread_message_id,
            price: payload.inbox_thread_offer_price,
            type: payload.inbox_thread_message_type,
            uid: payload.user_id,
            block: 0,
            is_new_message: true,
            isread: payload.is_read,
          },
        ] as InboxState["inboxThreadMessages"];
      }
      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === payload.inbox_thread_id
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          latest_type:
            payload.inbox_thread_latest_type ?? updatedInboxThread.latest_type,
          latest_time: payload.created_time,
          price: payload.inbox_thread_offer_price ?? updatedInboxThread.price,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
            isread: payload.is_read,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      } else {
        newInboxThreads = [
          {
            avatar: payload.user_avatar,
            currency: payload.currency,
            id: payload.inbox_thread_id,
            latest_time: payload.created_time,
            latest_type: payload.inbox_thread_latest_type,
            nickname: payload.user_nickname,
            p_image: payload.inbox_thread_offer_product_image,
            p_price: payload.inbox_thread_offer_product_price,
            p_state: payload.inbox_thread_offer_product_state,
            p_title: payload.inbox_thread_offer_product_title,
            pid: payload.inbox_thread_offer_product_id,
            price: payload.inbox_thread_offer_price,
            user_type: payload.user_type,
            new_text: {
              c_type: payload.content_type,
              content: payload.content,
              isread: payload.is_read,
            },
          },
          ...state.inboxThreads,
        ];
      }

      return {
        ...state,
        inboxThreadOffer: newInboxThreadOffer,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.UPDATE_INBOX_THREAD_OFFER_SUCCEEDED: {
      const payload = action.payload;

      const newInboxThreadOffer =
        payload.inbox_thread_id !== state.selectedInboxThreadId
          ? state.inboxThreadOffer
          : ({
              ...state.inboxThreadOffer,
              offer_price_origin: payload.inbox_thread_offer_price,
            } as InboxState["inboxThreadOffer"]);
      let newInboxThreadMessages = state.inboxThreadMessages;
      if (payload.inbox_thread_id === state.selectedInboxThreadId) {
        newInboxThreadMessages = [
          ...state.inboxThreadMessages,
          {
            c_type: payload.content_type,
            content: payload.content,
            create_time: payload.created_time,
            currency: payload.currency,
            from_type: payload.content_from_type,
            id: payload.inbox_thread_message_id,
            price: payload.inbox_thread_offer_price,
            type: payload.inbox_thread_message_type,
            uid: payload.user_id,
            block: 0,
            is_new_message: true,
            isread: payload.is_read,
          },
        ] as InboxState["inboxThreadMessages"];
      }

      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === payload.inbox_thread_id
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          latest_type: payload.inbox_thread_latest_type,
          latest_time: payload.created_time,
          price: payload.inbox_thread_offer_price,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
            isread: payload.is_read,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      } else {
        newInboxThreads = [
          {
            avatar: payload.user_avatar,
            currency: payload.currency,
            id: payload.inbox_thread_id,
            latest_time: payload.created_time,
            latest_type: payload.inbox_thread_latest_type,
            nickname: payload.user_nickname,
            p_image: payload.inbox_thread_offer_product_image,
            p_price: payload.inbox_thread_offer_product_price,
            p_state: payload.inbox_thread_offer_product_state,
            p_title: payload.inbox_thread_offer_product_title,
            pid: payload.inbox_thread_offer_product_id,
            price: payload.inbox_thread_offer_price,
            user_type: payload.user_type,
            new_text: {
              c_type: payload.content_type,
              content: payload.content,
              isread: payload.is_read,
            },
          },
          ...state.inboxThreads,
        ];
      }

      return {
        ...state,
        inboxThreadOffer: newInboxThreadOffer,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.CANCEL_INBOX_THREAD_OFFER_SUCCEEDED: {
      const payload = action.payload;

      const newInboxThreadOffer =
        payload.inbox_thread_id !== state.selectedInboxThreadId
          ? state.inboxThreadOffer
          : ({
              ...state.inboxThreadOffer,
              offer_status:
                inboxConstants.INBOX_THREAD_OFFER_NORMAL_OFFER_STATUS,
            } as InboxState["inboxThreadOffer"]);
      let newInboxThreadMessages = state.inboxThreadMessages;
      if (payload.inbox_thread_id === state.selectedInboxThreadId) {
        newInboxThreadMessages = [
          ...state.inboxThreadMessages,
          {
            c_type: payload.content_type,
            content: payload.content,
            create_time: payload.created_time,
            currency: payload.currency,
            from_type: payload.content_from_type,
            id: payload.inbox_thread_message_id,
            price: payload.inbox_thread_offer_price,
            type: payload.inbox_thread_message_type,
            uid: payload.user_id,
            block: 0,
            is_new_message: true,
            isread: payload.is_read,
          },
        ] as InboxState["inboxThreadMessages"];
      }

      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === payload.inbox_thread_id
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          latest_type: payload.inbox_thread_latest_type,
          latest_time: payload.created_time,
          price: payload.inbox_thread_offer_price,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
            isread: payload.is_read,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      } else {
        newInboxThreads = [
          {
            avatar: payload.user_avatar,
            currency: payload.currency,
            id: payload.inbox_thread_id,
            latest_time: payload.created_time,
            latest_type: payload.inbox_thread_latest_type,
            nickname: payload.user_nickname,
            p_image: payload.inbox_thread_offer_product_image,
            p_price: payload.inbox_thread_offer_product_price,
            p_state: payload.inbox_thread_offer_product_state,
            p_title: payload.inbox_thread_offer_product_title,
            pid: payload.inbox_thread_offer_product_id,
            price: payload.inbox_thread_offer_price,
            user_type: payload.user_type,
            new_text: {
              c_type: payload.content_type,
              content: payload.content,
              isread: payload.is_read,
            },
          },
          ...state.inboxThreads,
        ];
      }

      return {
        ...state,
        inboxThreadOffer: newInboxThreadOffer,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.ACCEPT_INBOX_THREAD_OFFER_SUCCEEDED: {
      const payload = action.payload;

      const newInboxThreadOffer =
        payload.inbox_thread_id !== state.selectedInboxThreadId
          ? state.inboxThreadOffer
          : ({
              ...state.inboxThreadOffer,
              offer_status:
                inboxConstants.INBOX_THREAD_OFFER_ACCEPTED_OFFER_STATUS,
            } as InboxState["inboxThreadOffer"]);
      let newInboxThreadMessages = state.inboxThreadMessages;
      if (payload.inbox_thread_id === state.selectedInboxThreadId) {
        newInboxThreadMessages = [
          ...state.inboxThreadMessages,
          {
            c_type: payload.content_type,
            content: payload.content,
            create_time: payload.created_time,
            currency: payload.currency,
            from_type: payload.content_from_type,
            id: payload.inbox_thread_message_id,
            price: payload.inbox_thread_offer_price,
            type: payload.inbox_thread_message_type,
            uid: payload.user_id,
            block: 0,
            is_new_message: true,
            isread: payload.is_read,
          },
        ] as InboxState["inboxThreadMessages"];
      }

      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === payload.inbox_thread_id
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          latest_type: payload.inbox_thread_latest_type,
          latest_time: payload.created_time,
          price: payload.inbox_thread_offer_price,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
            isread: payload.is_read,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      } else {
        newInboxThreads = [
          {
            avatar: payload.user_avatar,
            currency: payload.currency,
            id: payload.inbox_thread_id,
            latest_time: payload.created_time,
            latest_type: payload.inbox_thread_latest_type,
            nickname: payload.user_nickname,
            p_image: payload.inbox_thread_offer_product_image,
            p_price: payload.inbox_thread_offer_product_price,
            p_state: payload.inbox_thread_offer_product_state,
            p_title: payload.inbox_thread_offer_product_title,
            pid: payload.inbox_thread_offer_product_id,
            price: payload.inbox_thread_offer_price,
            user_type: payload.user_type,
            new_text: {
              c_type: payload.content_type,
              content: payload.content,
              isread: payload.is_read,
            },
          },
          ...state.inboxThreads,
        ];
      }

      return {
        ...state,
        inboxThreadOffer: newInboxThreadOffer,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.DECLINE_INBOX_THREAD_OFFER_SUCCEEDED: {
      const payload = action.payload;

      const newInboxThreadOffer =
        payload.inbox_thread_id !== state.selectedInboxThreadId
          ? state.inboxThreadOffer
          : ({
              ...state.inboxThreadOffer,
              offer_status:
                inboxConstants.INBOX_THREAD_OFFER_DECLINED_OFFER_STATUS,
            } as InboxState["inboxThreadOffer"]);
      let newInboxThreadMessages = state.inboxThreadMessages;
      if (payload.inbox_thread_id === state.selectedInboxThreadId) {
        newInboxThreadMessages = [
          ...state.inboxThreadMessages,
          {
            c_type: payload.content_type,
            content: payload.content,
            create_time: payload.created_time,
            currency: payload.currency,
            from_type: payload.content_from_type,
            id: payload.inbox_thread_message_id,
            price: payload.inbox_thread_offer_price,
            type: payload.inbox_thread_message_type,
            uid: payload.user_id,
            block: 0,
            is_new_message: true,
            isread: payload.is_read,
          },
        ] as InboxState["inboxThreadMessages"];
      }

      const updatedInboxThreadIndex = state.inboxThreads.findIndex(
        (inboxThread) => inboxThread.id === payload.inbox_thread_id
      );
      let newInboxThreads = [...state.inboxThreads];

      if (updatedInboxThreadIndex > -1) {
        const [updatedInboxThread] = newInboxThreads.splice(
          updatedInboxThreadIndex,
          1
        );
        const newUpdatedInboxThread = {
          ...updatedInboxThread,
          latest_type: payload.inbox_thread_latest_type,
          latest_time: payload.created_time,
          price: payload.inbox_thread_offer_price,
          new_text: {
            ...updatedInboxThread.new_text,
            c_type: payload.content_type,
            content: payload.content,
            isread: payload.is_read,
          },
        } as typeof updatedInboxThread;
        newInboxThreads.splice(0, 0, newUpdatedInboxThread);
      } else {
        newInboxThreads = [
          {
            avatar: payload.user_avatar,
            currency: payload.currency,
            id: payload.inbox_thread_id,
            latest_time: payload.created_time,
            latest_type: payload.inbox_thread_latest_type,
            nickname: payload.user_nickname,
            p_image: payload.inbox_thread_offer_product_image,
            p_price: payload.inbox_thread_offer_product_price,
            p_state: payload.inbox_thread_offer_product_state,
            p_title: payload.inbox_thread_offer_product_title,
            pid: payload.inbox_thread_offer_product_id,
            price: payload.inbox_thread_offer_price,
            user_type: payload.user_type,
            new_text: {
              c_type: payload.content_type,
              content: payload.content,
              isread: payload.is_read,
            },
          },
          ...state.inboxThreads,
        ];
      }

      return {
        ...state,
        inboxThreadOffer: newInboxThreadOffer,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.UNMARK_INBOX_THREAD_MESSAGE_NEW_MESSAGE: {
      const inboxThreadMessageId = action.payload;

      const newInboxThreadMessages = state.inboxThreadMessages.map(
        (inboxThreadMessage) => {
          if (inboxThreadMessage.id === inboxThreadMessageId) {
            return {
              ...inboxThreadMessage,
              is_new_message: false,
            };
          }
          return inboxThreadMessage;
        }
      );

      return {
        ...state,
        inboxThreadMessages: newInboxThreadMessages,
      };
    }

    case InboxActionTypes.MARK_INBOX_THREAD_MESSAGE_READ: {
      const { inboxThreadId, inboxThreadMessageId } = action.payload;

      const newInboxThreadMessages = state.inboxThreadMessages.map(
        (inboxThreadMessage) => {
          if (inboxThreadMessage.id === inboxThreadMessageId) {
            return {
              ...inboxThreadMessage,
              isread: 1 as const,
            };
          }
          return inboxThreadMessage;
        }
      );

      const newInboxThreads = state.inboxThreads.map((inboxThreadMessage) => {
        if (inboxThreadMessage.id === inboxThreadId) {
          return {
            ...inboxThreadMessage,
            new_text: {
              ...inboxThreadMessage.new_text,
              isread: 1 as const,
            },
          };
        }
        return inboxThreadMessage;
      });

      return {
        ...state,
        inboxThreadMessages: newInboxThreadMessages,
        inboxThreads: newInboxThreads,
      };
    }

    case InboxActionTypes.DELETE_INBOX_THREADS_SUCCEEDED: {
      const { threadIds } = action.payload;

      const newInboxThreads = state.inboxThreads.filter(
        (inboxThread) => !threadIds.includes(inboxThread.id)
      );

      return {
        ...state,
        inboxThreads: newInboxThreads,
        ...(threadIds.includes(state.selectedInboxThreadId!)
          ? {
              inboxThreadMessages: [],
              inboxThreadMessagesCount: 0,
              inboxThreadMessagesError: "",
              inboxThreadMessagesLoading: false,
              inboxThreadOffer: null,
              inboxThreadOfferError: "",
              inboxThreadOfferLoading: false,
            }
          : {}),
      };
    }

    case InboxActionTypes.UPDATE_INBOX_THREAD_AI_CHAT_STATUS_SUCCEEDED: {
      const { product_id, status } = action.payload;

      const newInboxThreadOffer = !!state.inboxThreadOffer
        ? { ...state.inboxThreadOffer }
        : state.inboxThreadOffer;

      if (newInboxThreadOffer?.product_id === product_id) {
        newInboxThreadOffer.chat_auto_reply_switch_status = status;
      }

      return {
        ...state,
        inboxThreadOffer: newInboxThreadOffer,
      };
    }

    case InboxActionTypes.SET_UNREAD_INBOX_THREAD_MESSAGE_COUNT: {
      return {
        ...state,
        unreadInboxThreadMessageCount: action.payload,
      };
    }

    default: {
      return state;
    }
  }
};

export default reducer;
