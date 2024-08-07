import { bindActionCreators } from "redux";

import { storeWebsocketAction } from "@/store";
import { inboxConstants } from "@/utils/constants";
import { inboxHelpers } from "@/utils/helpers";

import { useCallback, useMemo, useState } from "react";
import useIsomorphicLayoutEffect from "@/hooks/useIsomorphicLayoutEffect";
import { useTranslation } from "next-i18next";
import useAppSelector from "@/hooks/useAppSelector";
import useAppDispatch from "@/hooks/useAppDispatch";
import useEventCallback from "@/hooks/useEventCallback";

import type {
  InboxThreadMessageAddEventAIData,
  InboxThreadMessageAddEventData,
} from "@/hooks/useAppWebsocket/useAppWebsocket.types";

export type MessageEventData<D = any> = {
  command: string;
  data: D;
  success: boolean;
  message: string;
  time: number;
};

export type UseAppWebsocketProps = {
  onOpen?: (event: Event) => void;
  onError?: (event: Event) => void;
  onClose?: (event: CloseEvent) => void;
  onMessage?: (event: MessageEvent) => void;
  onRegister?: (event: MessageEvent, data: MessageEventData) => void;
  onInboxThreadReviewsSubmit?: (
    event: MessageEvent,
    data: MessageEventData<{
      chat_id: number;
    }>
  ) => void;
  onProductInboxThreadOfferCreate?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadOfferCreate?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadOfferUpdate?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadOfferCancel?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadOfferAccept?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadOfferDecline?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadMessageSubmit?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventData>
  ) => void;
  onInboxThreadAIMessageEmit?: (
    event: MessageEvent,
    data: MessageEventData<InboxThreadMessageAddEventAIData>
  ) => void;
  onInboxThreadFetch?: (
    event: MessageEvent,
    data: MessageEventData<number>
  ) => void;
  onInboxThreadMessageReadMark?: (
    event: MessageEvent,
    data: MessageEventData
  ) => void;
  onInboxThreadBlockedChange?: (
    event: MessageEvent,
    data: MessageEventData
  ) => void;
  onInboxThreadArchivedChange?: (
    event: MessageEvent,
    data: MessageEventData
  ) => void;
  onInboxThreadDelete?: (
    event: MessageEvent,
    data: MessageEventData<{
      chat_ids: number[];
      sender_id: number;
    }>
  ) => void;
  onSoldProductMark?: (
    event: MessageEvent,
    data: MessageEventData<{
      product: {
        id: number;
        state: number;
        status: number;
      };
      sender_id: number;
    }>
  ) => void;
  onInboxThreadAiChatStatusUpdate?: (
    event: MessageEvent,
    data: MessageEventData<{
      sender_id: number;
    }>
  ) => void;
};

const WEBSOCKET_EVENT_ERROR_MESSAGE =
  "Something went wrong, please try again or refresh the page";

const useAppWebsocket = (props?: UseAppWebsocketProps) => {
  const {
    onError,
    onOpen,
    onClose,
    onMessage,
    onRegister,
    onProductInboxThreadOfferCreate,
    onInboxThreadReviewsSubmit,
    onInboxThreadOfferCreate,
    onInboxThreadOfferUpdate,
    onInboxThreadOfferCancel,
    onInboxThreadOfferAccept,
    onInboxThreadOfferDecline,
    onInboxThreadMessageSubmit,
    onInboxThreadAIMessageEmit,
    onInboxThreadFetch,
    onInboxThreadMessageReadMark,
    onInboxThreadBlockedChange,
    onInboxThreadArchivedChange,
    onInboxThreadDelete,
    onSoldProductMark,
    onInboxThreadAiChatStatusUpdate,
  } = props ?? {};

  const $s_websocket = useAppSelector((state) => state.websocket.websocket);

  const [websocketState, setWebsocketState] = useState(
    $s_websocket?.readyState || WebSocket.CLOSED
  );

  const dispatch = useAppDispatch();

  const $s_websocketAction = useMemo(
    () => bindActionCreators(storeWebsocketAction, dispatch),
    [dispatch]
  );

  const { i18n } = useTranslation();

  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_authUserToken = useAppSelector((state) => state.auth.user?.token);
  const $s_commonRegionId = useAppSelector((state) => state.common.region?.id);

  const isConnecting = websocketState === WebSocket.CONNECTING;
  const isOpen = websocketState === WebSocket.OPEN;
  const isClosing = websocketState === WebSocket.CLOSING;
  const isClosed = websocketState === WebSocket.CLOSED;

  const language = i18n.language.toLowerCase();

  const connectionState = useMemo(() => {
    return {
      isConnecting,
      isOpen,
      isClosing,
      isClosed,
      websocketState,
    };
  }, [isConnecting, isOpen, isClosing, isClosed, websocketState]);

  const connectWebsocket = () => {
    $s_websocketAction.connectWebsocket();
  };

  const closeWebsocket = () => {
    $s_websocket?.close && $s_websocket.close();
  };

  const register = () => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            language,
            command: "register",
            user_id: $s_authUserId,
          })
        );
    } catch {}
  };

  const markInboxThreadMessageRead = (payload: {
    inboxThreadMessageId: number;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "mark_read",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            latest_chat_id: payload.inboxThreadMessageId,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const changeInboxThreadBlocked = (payload: {
    isBlocked: boolean;
    inboxThreadId: number;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "block",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: !!payload.isBlocked ? 1 : 2,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const submitInboxThreadReviews = (payload: {
    inboxThreadId: number;
    num: EmptySafeNumber;
    content: string;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "review",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            num: payload.num,
            content: payload.content,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const createProductInboxThreadOffer = (payload: {
    productId: number;
    price: EmptySafeNumber;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "offer",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            product_id: payload.productId,
            price: payload?.price,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const createInboxThreadOffer = (payload: {
    feId?: string;
    inboxThreadId: number;
    price: EmptySafeNumber;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "add",
            fe_id: payload.feId ?? "",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: inboxConstants.INBOX_THREAD_CREATED_OFFER_MESSAGE_TYPE,
            c_type: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE,
            price: payload?.price,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const updateInboxThreadOffer = (payload: {
    feId?: string;
    inboxThreadId: number;
    price: EmptySafeNumber;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "add",
            fe_id: payload.feId,
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: inboxConstants.INBOX_THREAD_UPDATED_OFFER_MESSAGE_TYPE,
            c_type: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE,
            price: payload?.price,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const cancelInboxThreadOffer = (payload: {
    feId?: string;
    inboxThreadId: number;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "add",
            fe_id: payload.feId ?? "",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: inboxConstants.INBOX_THREAD_CANCELLED_OFFER_MESSAGE_TYPE,
            c_type: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const fetchInboxThread = (payload: { productId: number }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "dialogue",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            product_id: payload.productId,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const acceptInboxThreadOffer = (payload: {
    feId?: string;
    inboxThreadId: number;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "add",
            fe_id: payload.feId,
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: inboxConstants.INBOX_THREAD_ACCEPTED_OFFER_MESSAGE_TYPE,
            c_type: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const declineInboxThreadOffer = (payload: {
    feId?: string;
    inboxThreadId: number;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "add",
            fe_id: payload.feId,
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: inboxConstants.INBOX_THREAD_DECLINED_OFFER_MESSAGE_TYPE,
            c_type: inboxConstants.INBOX_THREAD_MESSAGE_CONTENT_TEXT_TYPE,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const submitInboxThreadMessage = (payload: {
    feId: string;
    inboxThreadId: number;
    contentType: number;
    content: string;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "add",
            fe_id: payload.feId,
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            id: payload.inboxThreadId,
            type: inboxConstants.INBOX_THREAD_NORMAL_MESSAGE_TYPE,
            c_type: payload.contentType,
            content: payload.content,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const changeInboxThreadArchived = (payload: {
    inboxThreadIds: number[] | number;
    isArchived: boolean;
  }) => {
    try {
      $s_websocket &&
        $s_websocket.send(
          JSON.stringify({
            command: "archives",
            auth_token: $s_authUserToken ?? "",
            region: $s_commonRegionId,
            language,
            chat_ids: Array.isArray(payload.inboxThreadIds)
              ? payload.inboxThreadIds
              : !!payload.inboxThreadIds
              ? [payload.inboxThreadIds]
              : [],
            type: !!payload.isArchived ? 1 : 2,
          })
        );
      return {
        success: true,
        message: "",
      };
    } catch {
      return {
        success: false,
        message: WEBSOCKET_EVENT_ERROR_MESSAGE,
      };
    }
  };

  const handleWebsocketError = useCallback(
    (event: Event) => {
      onError && onError(event);
      setWebsocketState($s_websocket?.readyState || WebSocket.CLOSED);
    },
    [$s_websocket, onError]
  );

  const handleWebsocketClose = useCallback(
    (event: CloseEvent) => {
      onClose && onClose(event);
      setWebsocketState($s_websocket?.readyState || WebSocket.CLOSED);
    },
    [$s_websocket, onClose]
  );

  const handleWebsocketOpen = useCallback(
    (event: Event) => {
      onOpen && onOpen(event);
      setWebsocketState($s_websocket?.readyState || WebSocket.CLOSED);
    },
    [$s_websocket, onOpen]
  );

  const handleWebsocketMessage = useEventCallback((event: MessageEvent) => {
    onOpen && onOpen(event);
    onMessage && onMessage(event);
    const eventData = JSON.parse(event.data);
    const command = eventData.command ?? eventData?.data?.command;
    switch (command) {
      case "switch_ai_auto_reply": {
        onInboxThreadAiChatStatusUpdate &&
          onInboxThreadAiChatStatusUpdate(event, eventData);
        break;
      }
      case "register": {
        onRegister && onRegister(event, eventData);
        break;
      }
      case "review": {
        onInboxThreadReviewsSubmit &&
          onInboxThreadReviewsSubmit(event, eventData);
        break;
      }
      case "dialogue": {
        onInboxThreadFetch && onInboxThreadFetch(event, eventData);
        break;
      }
      case "delete": {
        onInboxThreadDelete && onInboxThreadDelete(event, eventData);
        break;
      }
      case "mark_read": {
        onInboxThreadMessageReadMark &&
          onInboxThreadMessageReadMark(event, eventData);
        break;
      }
      case "offer": {
        onProductInboxThreadOfferCreate &&
          onProductInboxThreadOfferCreate(event, eventData);
        break;
      }
      case "sold_out": {
        onSoldProductMark && onSoldProductMark(event, eventData);
        break;
      }
      case "block": {
        onInboxThreadBlockedChange &&
          onInboxThreadBlockedChange(event, eventData);
        break;
      }
      case "archives": {
        onInboxThreadArchivedChange &&
          onInboxThreadArchivedChange(event, eventData);
        break;
      }
      case "add": {
        switch (eventData?.data?.type) {
          case inboxConstants.INBOX_THREAD_CREATED_OFFER_MESSAGE_TYPE: {
            onInboxThreadOfferCreate &&
              onInboxThreadOfferCreate(event, eventData);
            break;
          }
          case inboxConstants.INBOX_THREAD_UPDATED_OFFER_MESSAGE_TYPE: {
            onInboxThreadOfferUpdate &&
              onInboxThreadOfferUpdate(event, eventData);
            break;
          }
          case inboxConstants.INBOX_THREAD_CANCELLED_OFFER_MESSAGE_TYPE: {
            onInboxThreadOfferCancel &&
              onInboxThreadOfferCancel(event, eventData);
            break;
          }
          case inboxConstants.INBOX_THREAD_ACCEPTED_OFFER_MESSAGE_TYPE: {
            onInboxThreadOfferAccept &&
              onInboxThreadOfferAccept(event, eventData);
            break;
          }
          case inboxConstants.INBOX_THREAD_DECLINED_OFFER_MESSAGE_TYPE: {
            onInboxThreadOfferDecline &&
              onInboxThreadOfferDecline(event, eventData);
            break;
          }
          case inboxConstants.INBOX_THREAD_NORMAL_MESSAGE_TYPE: {
            onInboxThreadMessageSubmit &&
              onInboxThreadMessageSubmit(event, eventData);
            break;
          }
          default: {
            if (inboxHelpers.isThreadMessageAI(eventData?.data?.from_type)) {
              onInboxThreadAIMessageEmit &&
                onInboxThreadAIMessageEmit(event, eventData);
            }
          }
        }
        break;
      }
    }
  });

  useIsomorphicLayoutEffect(() => {
    if (!$s_websocket) return;
    $s_websocket.addEventListener("close", handleWebsocketClose);
    return () => {
      $s_websocket.removeEventListener("close", handleWebsocketClose);
    };
  }, [handleWebsocketClose]);

  useIsomorphicLayoutEffect(() => {
    if (!$s_websocket) return;
    $s_websocket.addEventListener("error", handleWebsocketError);
    return () => {
      $s_websocket.removeEventListener("error", handleWebsocketError);
    };
  }, [handleWebsocketError]);

  useIsomorphicLayoutEffect(() => {
    if (!$s_websocket) return;
    $s_websocket.addEventListener("open", handleWebsocketOpen);
    return () => {
      $s_websocket.removeEventListener("open", handleWebsocketOpen);
    };
  }, [handleWebsocketOpen]);

  useIsomorphicLayoutEffect(() => {
    if (!$s_websocket) return;
    $s_websocket.addEventListener("message", handleWebsocketMessage);
    return () => {
      $s_websocket.removeEventListener("message", handleWebsocketMessage);
    };
  }, [$s_websocket]);

  return {
    websocket: $s_websocket,
    connectionState,
    connectWebsocket,
    closeWebsocket,
    register,
    submitInboxThreadReviews,
    createProductInboxThreadOffer,
    createInboxThreadOffer,
    updateInboxThreadOffer,
    cancelInboxThreadOffer,
    acceptInboxThreadOffer,
    declineInboxThreadOffer,
    submitInboxThreadMessage,
    changeInboxThreadArchived,
    fetchInboxThread,
    markInboxThreadMessageRead,
    changeInboxThreadBlocked,
  };
};

export default useAppWebsocket;
