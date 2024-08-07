import { v4 as uuidv4 } from "uuid";
import { bindActionCreators } from "redux";
import axios from "axios";
import { toast } from "react-toastify";

import { storeAdAction, storeInboxAction, storeInboxSelectors } from "@/store";
import {
  axiosHelpers,
  commonHelpers,
  inboxHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import { alertDialogService, loadingScreenOverlayService } from "@/services";
import { inboxApi } from "@/utils/apis";

import { useMediaQuery } from "@mui/material";
import { SwipeableDrawer as Drawer } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import InboxThreadContent from "@/views/InboxSlug/components/InboxThreadContent";
import InboxThreadList from "@/views/InboxSlug/components/InboxThreadList";
import AppPaper from "@/components/AppPaper";
import OfferFormModal from "@/containers/OfferFormModal";
import InboxThreadReviewsFormDialog from "@/containers/InboxThreadReviewsFormDialog";
import GalleryDialog from "@/components/GalleryDialog";

import useStyles from "./InboxSlug.styles";

import { useContext, useEffect, useMemo, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useAppWebsocket,
  useIsMounted,
} from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

import type { OfferFormModalProps } from "@/containers/OfferFormModal/OfferFormModal";
import type { InboxSlugContextValue } from "@/views/InboxSlug/InboxSlug.context";
import type { CancelTokenSource } from "axios";
import type { GalleryDialogProps } from "@/components/GalleryDialog";
import AiChatUserListTurnOffDialog from "@/views/InboxSlug/components/AiChatUserListTurnOffDialog";
import { inboxConstants } from "@/utils/constants";
import AiChatUserListTurnOnDialog from "@/views/InboxSlug/components/AiChatUserListTurnOnDialog";

const FetchData = () => {
  const fetchedInboxThreadsAdsSourceRef = useRef<CancelTokenSource | null>(
    null
  );

  const dispatch = useAppDispatch();

  const $s_adAction = useMemo(
    () => bindActionCreators(storeAdAction, dispatch),
    [dispatch]
  );

  const fetchInboxThreadsAds = () => {
    fetchedInboxThreadsAdsSourceRef.current &&
      fetchedInboxThreadsAdsSourceRef.current!.cancel();
    fetchedInboxThreadsAdsSourceRef.current = axios.CancelToken.source();
    $s_adAction.fetchAdsSaga(
      {
        params: {
          scopes: ["inboxThreadsAds"],
        },
        cancelToken: fetchedInboxThreadsAdsSourceRef.current.token,
      },
      {
        isReset: true,
      }
    );
  };

  useEffect(() => {
    fetchInboxThreadsAds();
    return () => {
      fetchedInboxThreadsAdsSourceRef.current?.cancel &&
        fetchedInboxThreadsAdsSourceRef.current.cancel();
    };
  }, []);

  return null;
};

const InboxThreadContentDrawer = () => {
  const { inboxThreadContentDrawerOpen, closeInboxThreadContentDrawer } =
    useContext(InboxSlugContext);

  const { classes, theme, cx } = useStyles();

  const isTablet = useMediaQuery(theme.breakpoints.down("tablet"));

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );

  return (
    <Drawer
      variant={isTablet ? "temporary" : "persistent"}
      anchor="right"
      keepMounted
      open={
        !isTablet
          ? true
          : !!$s_selectedInboxThreadId && inboxThreadContentDrawerOpen
      }
      classes={{
        root: cx(
          classes.inboxThreadMessageDrawer,
          !isTablet && classes.desktop
        ),
        paper: classes.inboxThreadMessageDrawerPaper,
      }}
      sx={{
        pointerEvents:
          !isTablet ||
          (!!$s_selectedInboxThreadId && inboxThreadContentDrawerOpen)
            ? "auto"
            : "none",
      }}
      onClose={closeInboxThreadContentDrawer}
      onOpen={() => {}}
    >
      <InboxThreadContent />
    </Drawer>
  );
};

const InboxWebsocketListener = () => {
  const { closeInboxThreadContentShow, closeInboxThreadContentDrawer } =
    useContext(InboxSlugContext);

  const fetchedInboxThreadsRef = useRef<CancelTokenSource | null>(null);
  const fetchedInboxThreadOfferRef = useRef<CancelTokenSource | null>(null);
  const fetchedInboxThreadMessagesRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  const $s_selectedInboxThreadType = useAppSelector(
    (state) => state.inbox.selectedInboxThreadType
  );
  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );
  const $s_inboxThreadOfferAuthUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferAuthUser
  );

  const reFetchInboxThreads = () => {
    fetchedInboxThreadsRef.current?.cancel &&
      fetchedInboxThreadsRef.current.cancel();
    fetchedInboxThreadsRef.current = axios.CancelToken.source();
    $s_inboxAction.fetchInboxThreadsSaga(
      {
        params: {
          type: $s_selectedInboxThreadType!,
        },
        cancelToken: fetchedInboxThreadsRef.current.token,
      },
      {
        loadingDisabled: true,
      }
    );
  };

  const reFetchInboxThreadOffer = () => {
    fetchedInboxThreadOfferRef.current?.cancel &&
      fetchedInboxThreadOfferRef.current.cancel();
    fetchedInboxThreadOfferRef.current = axios.CancelToken.source();
    $s_inboxAction.fetchInboxThreadOfferSaga(
      {
        params: {
          inbox_thread_id: $s_selectedInboxThreadId!,
        },
        cancelToken: fetchedInboxThreadOfferRef.current.token,
      },
      {
        loadingDisabled: true,
      }
    );
  };

  const reFetchInboxThreadMessages = () => {
    fetchedInboxThreadMessagesRef.current?.cancel &&
      fetchedInboxThreadMessagesRef.current.cancel();
    fetchedInboxThreadMessagesRef.current = axios.CancelToken.source();
    $s_inboxAction.fetchInboxThreadMessagesSaga(
      {
        params: {
          inbox_thread_id: $s_selectedInboxThreadId!,
        },
        cancelToken: fetchedInboxThreadMessagesRef.current.token,
      },
      {
        loadingDisabled: true,
        params: {
          is_reFetched: true,
        },
      }
    );
  };

  // const $s_isInboxThreadOfferAuthSeller = useAppSelector(
  //   storeInboxSelectors.selectIsInboxThreadOfferAuthSeller
  // );

  useAppWebsocket({
    onInboxThreadAiChatStatusUpdate: (_, eventData) => {
      if (eventData.success) {
        reFetchInboxThreadOffer();
      }
    },
    onSoldProductMark: (_, eventData) => {
      if (eventData.success) {
        reFetchInboxThreads();
        reFetchInboxThreadOffer();
      }
    },
    onInboxThreadDelete: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if (data?.sender_id === $s_inboxThreadOfferAuthUser?.id) {
          const deletedInboxThreadIds = (data.chat_ids ?? []).map((threadId) =>
            Number(threadId)
          );
          $s_inboxAction.deleteInboxThreadSucceeded({
            threadIds: deletedInboxThreadIds,
          });
          if (deletedInboxThreadIds.includes($s_selectedInboxThreadId!)) {
            closeInboxThreadContentShow();
            closeInboxThreadContentDrawer();
          }
        }
      }
    },
    onInboxThreadArchivedChange: (_, eventData) => {
      if (eventData.success) {
        reFetchInboxThreads();
        reFetchInboxThreadOffer();
        reFetchInboxThreadMessages();
      }
    },
    onInboxThreadMessageReadMark: (_, eventData) => {
      if (eventData.success) {
        reFetchInboxThreads();
        reFetchInboxThreadMessages();
      }
    },
    onInboxThreadAIMessageEmit: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if (data.thread_id === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.submitInboxThreadMessageSucceeded({
        //   content_type: inboxConstants.INBOX_THREAD_CONTENT_TEXT_TYPE,
        //   content: data.msg!,
        //   content_from_type: data.from_type!,
        //   created_time: Number(momentWithLocale().format("X")),
        //   currency: "",
        //   inbox_thread_message_id: data.message_id,
        //   inbox_thread_offer_price: 0,
        //   inbox_thread_message_type:
        //     inboxConstants.INBOX_THREAD_NORMAL_MESSAGE_TYPE,
        //   inbox_thread_id: data.thread_id!,
        //   user_id: 0,
        //   user_nickname: "",
        //   user_avatar: "",
        //   user_type: "",
        //   is_read: data.isread,
        //   inbox_thread_offer_product_id: 0,
        //   inbox_thread_offer_product_image: "",
        //   inbox_thread_offer_product_price: "",
        //   inbox_thread_offer_product_state: 0,
        //   inbox_thread_offer_product_title: "",
        // });
      }
    },
    onInboxThreadMessageSubmit: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.submitInboxThreadMessageSucceeded({
        //   fe_id: data.fe_id,
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      } else {
        $s_inboxAction.submitInboxThreadMessageFailed({
          fe_id: eventData.data.fe_id,
        });
      }
    },
    onProductInboxThreadOfferCreate: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.createInboxThreadOfferSucceeded({
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      }
    },
    onInboxThreadOfferCreate: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.createInboxThreadOfferSucceeded({
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      }
    },
    onInboxThreadOfferUpdate: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.updateInboxThreadOfferSucceeded({
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      }
    },
    onInboxThreadOfferCancel: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.cancelInboxThreadOfferSucceeded({
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      }
    },
    onInboxThreadOfferAccept: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.acceptInboxThreadOfferSucceeded({
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      }
    },
    onInboxThreadOfferDecline: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        reFetchInboxThreads();
        if ((data.thread_id || data.chat_id) === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.declineInboxThreadOfferSucceeded({
        //   content_type: data.c_type!,
        //   content: data.content!,
        //   content_from_type: data.from_type!,
        //   created_time: data.create_time!,
        //   currency: data.currency!,
        //   inbox_thread_message_id: data.message_id!,
        //   inbox_thread_offer_price: data.price!,
        //   inbox_thread_message_type: data.type!,
        //   inbox_thread_id: data.thread_id!,
        //   inbox_thread_latest_type: data.thread_object?.latest_type!,
        //   user_id: data.uid!,
        //   user_nickname: data.thread_object?.nickname!,
        //   user_avatar: data.thread_object?.avatar!,
        //   user_type: data.thread_object?.user_type!,
        //   is_read: data.thread_object?.new_text?.isread!,
        //   inbox_thread_offer_product_id: data.thread_object?.pid!,
        //   inbox_thread_offer_product_image: data.thread_object?.p_image!,
        //   inbox_thread_offer_product_price: data.thread_object?.p_price!,
        //   inbox_thread_offer_product_state: data.thread_object?.p_state!,
        //   inbox_thread_offer_product_title: data.thread_object?.p_title!,
        // });
      }
    },
    onInboxThreadReviewsSubmit: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        if (data.chat_id === $s_selectedInboxThreadId) {
          reFetchInboxThreadMessages();
          reFetchInboxThreadOffer();
        }
        // $s_inboxAction.submitInboxReviewsSucceeded({
        //   inbox_thread_id: data.chat_id,
        //   is_seller: $s_isInboxThreadOfferAuthSeller,
        // });
      }
    },
    onInboxThreadBlockedChange: (_, eventData) => {
      if (eventData.success) {
        reFetchInboxThreadOffer();
      }
    },
  });

  useEffect(() => {
    return () => {
      fetchedInboxThreadsRef.current?.cancel &&
        fetchedInboxThreadsRef.current.cancel();
      fetchedInboxThreadOfferRef.current?.cancel &&
        fetchedInboxThreadOfferRef.current.cancel();
      fetchedInboxThreadMessagesRef.current?.cancel &&
        fetchedInboxThreadMessagesRef.current.cancel();
    };
  }, [$s_selectedInboxThreadId]);

  return null;
};

const OfferCreateFormModal = () => {
  const { offerCreateFormModalOpen, closeOfferCreateFormModal } =
    useContext(InboxSlugContext);

  const $s_inboxThreadOfferStateItem = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferStateItem
  );
  const isInboxThreadOfferNormalOfferStatus =
    inboxHelpers.isInboxThreadOfferNormalOfferStatus(
      $s_inboxThreadOfferStateItem?.status
    );
  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );

  useEffect(() => {
    if (!isMounted()) return;
    if (!isInboxThreadOfferNormalOfferStatus) {
      closeOfferCreateFormModal();
    }
  }, [isInboxThreadOfferNormalOfferStatus]);

  const isMounted = useIsMounted();

  return (
    <OfferFormModal
      inboxThreadId={$s_selectedInboxThreadId!}
      currency={$s_inboxThreadOfferStateItem?.currency}
      variant="created"
      open={offerCreateFormModalOpen}
      onClose={closeOfferCreateFormModal}
      onSubmitSucceed={closeOfferCreateFormModal}
    />
  );
};

const OfferUpdateFormModal = () => {
  const { offerUpdateFormModalOpen, closeOfferUpdateFormModal } =
    useContext(InboxSlugContext);

  const $s_inboxThreadOfferStateItem = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferStateItem
  );
  const isInboxThreadOfferCreatedOfferStatus =
    inboxHelpers.isInboxThreadOfferCreatedOfferStatus(
      $s_inboxThreadOfferStateItem?.status
    );
  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );

  const offerFormModalDefaultValues = useMemo<
    OfferFormModalProps["defaultValues"]
  >(() => {
    return {
      price: (commonHelpers.isNumber($s_inboxThreadOfferStateItem?.price_origin)
        ? Number($s_inboxThreadOfferStateItem?.price_origin)
        : "") as EmptySafeNumber,
    };
  }, [$s_inboxThreadOfferStateItem?.price_origin]);

  useEffect(() => {
    if (!isMounted()) return;
    if (!isInboxThreadOfferCreatedOfferStatus) {
      closeOfferUpdateFormModal();
    }
  }, [isInboxThreadOfferCreatedOfferStatus]);

  const isMounted = useIsMounted();

  return (
    <OfferFormModal
      inboxThreadId={$s_selectedInboxThreadId!}
      currency={$s_inboxThreadOfferStateItem?.currency}
      defaultValues={offerFormModalDefaultValues}
      open={offerUpdateFormModalOpen}
      variant="updated"
      onClose={closeOfferUpdateFormModal}
      onSubmitSucceed={closeOfferUpdateFormModal}
    />
  );
};

const InboxThreadOfferStatusTracker = (props: {
  onInboxThreadOfferStatusChange?: () => void;
}) => {
  const { onInboxThreadOfferStatusChange } = props;
  const $s_inboxThreadOfferStateItem = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferStateItem
  );

  useEffect(() => {
    if (!isMounted()) return;
    onInboxThreadOfferStatusChange && onInboxThreadOfferStatusChange();
  }, [$s_inboxThreadOfferStateItem?.status]);

  const isMounted = useIsMounted();

  return null;
};

const StyledInboxThreadReviewsFormDialog = () => {
  const {
    inboxThreadReviewsFormDialogOpen,
    closeInboxThreadReviewsFormDialog,
  } = useContext(InboxSlugContext);

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );

  return (
    <InboxThreadReviewsFormDialog
      open={inboxThreadReviewsFormDialogOpen}
      inboxThreadId={$s_selectedInboxThreadId!}
      onSubmitSucceed={closeInboxThreadReviewsFormDialog}
      onClose={closeInboxThreadReviewsFormDialog}
    />
  );
};

const InboxSlug = () => {
  const [
    inboxThreadReviewsFormDialogOpen,
    setInboxThreadReviewsFormDialogOpen,
  ] = useState(false);
  const [offerCreateFormModalOpen, setOfferCreateFormModalOpen] =
    useState(false);
  const [offerUpdateFormModalOpen, setOfferUpdateFormModalOpen] =
    useState(false);
  const [selectedInboxThreadIds, setSelectedInboxThreadIds] = useState<
    number[]
  >([]);
  const [inboxThreadSelectable, setInboxThreadSelectable] = useState(false);
  const [galleryDialogOpen, setGalleryDialogOpen] = useState(false);
  const [galleryDialogItems, setGalleryDialogItems] = useState<
    GalleryDialogProps["items"]
  >([]);
  const [galleryDialogSelectedItemIndex, setGalleryDialogSelectedItemIndex] =
    useState(0);
  const [aiChatUserListTurnOffDialogOpen, setAiChatUserListTurnOffDialogOpen] =
    useState(false);
  const [aiChatUserListTurnOnDialogOpen, setAiChatUserListTurnOnDialogOpen] =
    useState(false);

  const router = useRouter();

  const { t } = useTranslation();

  const updatedInboxThreadProductAiChatStatusSourceRef =
    useRef<CancelTokenSource | null>(null);
  const fetchedInboxThreadOfferSource = useRef<CancelTokenSource | null>(null);
  const cancelOfferFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const cancelOfferFeIdRef = useRef<null | string>(null);
  const declineOfferFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const declineOfferFeIdRef = useRef<null | string>(null);
  const acceptOfferFeIdRef = useRef<null | string>(null);
  const acceptOfferFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const closeInboxThreadSelectableOnChangeInboxThreadArchivedRef =
    useRef(false);
  const changeInboxThreadArchivedFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const changeInboxThreadBlockedFailedTimeoutRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);

  const dispatch = useAppDispatch();

  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );
  const $s_inboxThreadOfferAuthUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferAuthUser
  );
  const $s_inboxThreadOfferProduct = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferProduct
  );

  const appWebsocket = useAppWebsocket({
    onInboxThreadDelete: (_, eventData) => {
      if (eventData.success) {
        const data = eventData.data;
        if (data?.sender_id === $s_inboxThreadOfferAuthUser?.id) {
          const deletedInboxThreadIds = (data.chat_ids ?? []).map((threadId) =>
            Number(threadId)
          );
          const newSelectedInboxThreadIds = selectedInboxThreadIds.filter(
            (inboxThreadId) => !deletedInboxThreadIds.includes(inboxThreadId)
          );
          setSelectedInboxThreadIds(newSelectedInboxThreadIds);
        }
      }
    },
    onInboxThreadArchivedChange: (_, eventData) => {
      if (!changeInboxThreadArchivedFailedTimeoutRef.current) return;
      clearTimeout(changeInboxThreadArchivedFailedTimeoutRef.current!);
      changeInboxThreadArchivedFailedTimeoutRef.current = null;
      if (eventData.success) {
        closeInboxThreadSelectableOnChangeInboxThreadArchivedRef.current &&
          closeInboxThreadSelectable();
        toast.success(t("archivedSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      closeInboxThreadSelectableOnChangeInboxThreadArchivedRef.current = false;
      loadingScreenOverlayService.close();
    },
    onInboxThreadBlockedChange: (_, eventData) => {
      if (!changeInboxThreadBlockedFailedTimeoutRef.current) return;
      clearTimeout(changeInboxThreadBlockedFailedTimeoutRef.current!);
      changeInboxThreadBlockedFailedTimeoutRef.current = null;
      if (eventData.success) {
        toast.success(t("blockedUserSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
    onInboxThreadOfferCancel: (_, eventData) => {
      if (
        (eventData.data?.thread_id || eventData.data?.chat_id) !==
          $s_selectedInboxThreadId ||
        cancelOfferFeIdRef.current !== eventData.data?.fe_id
      )
        return;
      cancelOfferFeIdRef.current = null;
      clearTimeout(cancelOfferFailedTimeoutRef.current!);
      if (eventData.success) {
        toast.success(t("cancelledSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
    onInboxThreadOfferDecline: (_, eventData) => {
      if (
        (eventData.data?.thread_id || eventData.data?.chat_id) !==
          $s_selectedInboxThreadId ||
        declineOfferFeIdRef.current !== eventData.data?.fe_id
      )
        return;
      declineOfferFeIdRef.current = null;
      clearTimeout(declineOfferFailedTimeoutRef.current!);
      if (eventData.success) {
        toast.success(t("declinedSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
    onInboxThreadOfferAccept: (_, eventData) => {
      if (
        (eventData.data?.thread_id || eventData.data?.chat_id) !==
          $s_selectedInboxThreadId ||
        acceptOfferFeIdRef.current !== eventData.data?.fe_id
      )
        return;
      acceptOfferFeIdRef.current = null;
      clearTimeout(acceptOfferFailedTimeoutRef.current!);
      if (eventData.success) {
        toast.success(t("acceptedSuccessfully"));
      } else {
        toast.error(eventData.message);
      }
      loadingScreenOverlayService.close();
    },
  });

  const [inboxThreadContentDrawerOpen, setInboxThreadContentDrawerOpen] =
    useState<InboxSlugContextValue["inboxThreadContentDrawerOpen"]>(
      !!$s_selectedInboxThreadId
    );
  const [inboxThreadContentShow, setInboxThreadContentShow] = useState(
    !!$s_selectedInboxThreadId
  );

  const { classes } = useStyles();

  const handleGalleryDialogClose = () => {
    setGalleryDialogOpen(false);
  };

  const openGalleryDialog: InboxSlugContextValue["openGalleryDialog"] = (
    payload
  ) => {
    setGalleryDialogOpen(true);
    setGalleryDialogItems(payload.items);
    setGalleryDialogSelectedItemIndex(payload.selectedItemIndex ?? 0);
  };

  const changeSelectedInboxThreadId: InboxSlugContextValue["changeSelectedInboxThreadId"] =
    (inboxThreadId) => {
      setInboxThreadContentShow(true);
      if (inboxThreadId === $s_selectedInboxThreadId) {
        setInboxThreadContentDrawerOpen(true);
        return;
      }
      fetchedInboxThreadOfferSource.current?.cancel &&
        fetchedInboxThreadOfferSource.current.cancel();
      fetchedInboxThreadOfferSource.current = axios.CancelToken.source();
      setInboxThreadContentDrawerOpen(true);
      $s_inboxAction.setSelectedInboxThreadId(inboxThreadId);
      $s_inboxAction.fetchInboxThreadOfferSaga(
        {
          params: {
            inbox_thread_id: inboxThreadId,
          },
          cancelToken: fetchedInboxThreadOfferSource.current.token,
        },
        {
          isReset: true,
        }
      );
      router.push(`/inbox/${inboxThreadId}`, undefined, {
        scroll: false,
        shallow: true,
      });
    };

  const openAiChatUserListTurnOffDialog = () => {
    setAiChatUserListTurnOffDialogOpen(true);
  };

  const closeAiChatUserListTurnOffDialog = () => {
    setAiChatUserListTurnOffDialogOpen(false);
  };

  const turnOffInboxThreadAiChatUsers: InboxSlugContextValue["turnOffInboxThreadAiChatUsers"] =
    async (payload) => {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      updatedInboxThreadProductAiChatStatusSourceRef.current =
        axios.CancelToken.source();
      const response = await reduxHelpers.callActionWithPromise(
        $s_inboxAction.updateInboxThreadAiChatStatus,
        {
          params: {
            product_id: $s_inboxThreadOfferProduct?.id!,
            user_ids: payload.userIds,
            type: inboxConstants.INBOX_THREAD_AI_CHAT_OFF_TYPE,
            chat_auto_reply_disable_seconds: payload.seconds,
          },
          cancelToken:
            updatedInboxThreadProductAiChatStatusSourceRef.current.token,
        }
      );
      if (axiosHelpers.checkRequestSuccess(response)) {
        toast.success(t("turnedOffSuccessfully"));
        closeAiChatUserListTurnOffDialog();
      } else {
        toast.error(response.message);
      }
      loadingScreenOverlayService.close();
    };

  const turnOnInboxThreadAiChatUsers: InboxSlugContextValue["turnOnInboxThreadAiChatUsers"] =
    async (payload) => {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      updatedInboxThreadProductAiChatStatusSourceRef.current =
        axios.CancelToken.source();
      const response = await reduxHelpers.callActionWithPromise(
        $s_inboxAction.updateInboxThreadAiChatStatus,
        {
          params: {
            product_id: $s_inboxThreadOfferProduct?.id!,
            user_ids: payload.userIds,
            type: inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE,
          },
          cancelToken:
            updatedInboxThreadProductAiChatStatusSourceRef.current.token,
        }
      );
      if (axiosHelpers.checkRequestSuccess(response)) {
        toast.success(t("turnedOnSuccessfully"));
        closeAiChatUserListTurnOnDialog();
      } else {
        toast.error(response.message);
      }
      loadingScreenOverlayService.close();
    };

  const openAiChatUserListTurnOnDialog = () => {
    setAiChatUserListTurnOnDialogOpen(true);
  };

  const closeAiChatUserListTurnOnDialog = () => {
    setAiChatUserListTurnOnDialogOpen(false);
  };

  const closeInboxThreadContentShow = () => {
    setInboxThreadContentShow(false);
  };

  const openInboxThreadContentShow = () => {
    setInboxThreadContentShow(true);
  };

  const closeInboxThreadContentDrawer = () => {
    setInboxThreadContentDrawerOpen(false);
  };

  const openInboxThreadReviewsFormDialog = () => {
    setInboxThreadReviewsFormDialogOpen(true);
  };

  const closeInboxThreadReviewsFormDialog = () => {
    setInboxThreadReviewsFormDialogOpen(false);
  };

  const openOfferCreateFormModal = () => {
    setOfferCreateFormModalOpen(true);
  };

  const closeOfferCreateFormModal = () => {
    setOfferCreateFormModalOpen(false);
  };

  const openOfferUpdateFormModal = () => {
    setOfferUpdateFormModalOpen(true);
  };

  const closeOfferUpdateFormModal = () => {
    setOfferUpdateFormModalOpen(false);
  };

  const toastCommonError = () => {
    toast.error(t("noResponseServerErrorMessage"));
    loadingScreenOverlayService.close();
  };

  const deleteInboxThread = async (payload: {
    inboxThreadIds: number[];
    closeInboxThreadSelectableOnChange?: boolean;
  }) => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("deleteInboxConfirmationTitle"),
      content: t("deleteInboxConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    try {
      const { data: response } = await inboxApi.deleteInboxThreads({
        params: {
          chat_ids: payload.inboxThreadIds,
        },
      });
      if (axiosHelpers.checkRequestSuccess(response)) {
        payload.closeInboxThreadSelectableOnChange &&
          closeInboxThreadSelectable();
        $s_inboxAction.deleteInboxThreadSucceeded({
          threadIds: payload.inboxThreadIds,
        });
        if (payload.inboxThreadIds.includes($s_selectedInboxThreadId!)) {
          closeInboxThreadContentDrawer();
          closeInboxThreadContentShow();
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      if (!axios.isCancel(error)) {
        const message = axiosHelpers.getErrorMessage(error);
        toast.error(message);
      }
    }
    loadingScreenOverlayService.close();
  };

  const changeInboxThreadArchivedFailed = () => {
    toastCommonError();
  };
  const changeInboxThreadArchived = async (payload: {
    isArchived: boolean;
    inboxThreadIds: number[];
    closeInboxThreadSelectableOnChange?: boolean;
  }) => {
    closeInboxThreadSelectableOnChangeInboxThreadArchivedRef.current =
      !!payload.closeInboxThreadSelectableOnChange;
    const response = appWebsocket.changeInboxThreadArchived({
      inboxThreadIds: payload.inboxThreadIds,
      isArchived: payload.isArchived,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      changeInboxThreadArchivedFailedTimeoutRef.current = setTimeout(
        changeInboxThreadArchivedFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const changeInboxThreadBlockedFailed = () => {
    toastCommonError();
  };
  const changeInboxThreadBlocked = async (payload: { isBlocked: boolean }) => {
    const { isConfirmed } = await alertDialogService.fire({
      title: payload.isBlocked
        ? t("blockedUserConfirmationTitle")
        : t("unblockedUserConfirmationTitle"),
      content: payload.isBlocked
        ? t("blockedUserConfirmationContent")
        : t("unblockedUserConfirmationContent"),
    });
    if (!isConfirmed) return;
    const response = appWebsocket.changeInboxThreadBlocked({
      isBlocked: !!payload?.isBlocked,
      inboxThreadId: $s_selectedInboxThreadId!,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      changeInboxThreadBlockedFailedTimeoutRef.current = setTimeout(
        changeInboxThreadBlockedFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const cancelOfferFailed = () => {
    toastCommonError();
  };
  const cancelInboxOffer = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("cancelOfferConfirmationTitle"),
      content: t("cancelOfferConfirmationContent"),
    });
    if (!isConfirmed) return;
    cancelOfferFeIdRef.current = uuidv4();
    const response = appWebsocket.cancelInboxThreadOffer({
      feId: cancelOfferFeIdRef.current!,
      inboxThreadId: $s_selectedInboxThreadId!,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      cancelOfferFailedTimeoutRef.current = setTimeout(
        cancelOfferFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const acceptOfferFailed = () => {
    toastCommonError();
  };
  const acceptInboxOffer = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("acceptOfferConfirmationTitle"),
      content: t("acceptOfferConfirmationContent"),
    });
    if (!isConfirmed) return;

    acceptOfferFeIdRef.current = uuidv4();
    const response = appWebsocket.acceptInboxThreadOffer({
      feId: acceptOfferFeIdRef.current!,
      inboxThreadId: $s_selectedInboxThreadId!,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${t("pending")}...`);
      acceptOfferFailedTimeoutRef.current = setTimeout(
        acceptOfferFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const declineOfferFailed = () => {
    toastCommonError();
  };
  const declineInboxOffer = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("declineOfferConfirmationTitle"),
      content: t("declineOfferConfirmationContent"),
    });
    if (!isConfirmed) return;

    declineOfferFeIdRef.current = uuidv4();
    const response = appWebsocket.declineInboxThreadOffer({
      feId: declineOfferFeIdRef.current!,
      inboxThreadId: $s_selectedInboxThreadId!,
    });

    if (axiosHelpers.checkRequestSuccess(response)) {
      loadingScreenOverlayService.fire(`${"pending"}...`);
      declineOfferFailedTimeoutRef.current = setTimeout(
        declineOfferFailed,
        30000
      );
    } else {
      toast.error(response.message);
    }
  };

  const clearInboxThreadOfferActionsTimeout = () => {
    clearTimeout(cancelOfferFailedTimeoutRef.current!);
    clearTimeout(declineOfferFailedTimeoutRef.current!);
    clearTimeout(acceptOfferFailedTimeoutRef.current!);
    // cancelOfferFeIdRef.current = null;
    // declineOfferFeIdRef.current = null;
    // acceptOfferFeIdRef.current = null;
    closeOfferCreateFormModal();
    closeOfferUpdateFormModal();
    closeInboxThreadReviewsFormDialog();
  };

  const openInboxThreadSelectable = () => {
    setInboxThreadSelectable(true);
  };

  const closeInboxThreadSelectable = () => {
    setInboxThreadSelectable(false);
    setSelectedInboxThreadIds([]);
  };

  const removeAllSelectedInboxThreadId = () => {
    setSelectedInboxThreadIds([]);
  };

  const addSelectedInboxThreadId = (inboxId: number) => {
    setSelectedInboxThreadIds((prevInboxIds) => [...prevInboxIds, inboxId]);
  };

  const removeSelectedInboxThreadId = (inboxThreadId: number) => {
    setSelectedInboxThreadIds((prevInboxThreadIds) => {
      const newInboxThreadIds = [...prevInboxThreadIds].filter(
        (_inboxThreadId) => _inboxThreadId !== inboxThreadId
      );
      return newInboxThreadIds;
    });
  };

  useEffect(() => {
    if (!isMounted()) return;
    closeAiChatUserListTurnOnDialog();
    closeAiChatUserListTurnOffDialog();
  }, [$s_inboxThreadOfferProduct?.id]);

  useEffect(() => {
    if (!isMounted()) return;
    clearInboxThreadOfferActionsTimeout();
    clearTimeout(changeInboxThreadBlockedFailedTimeoutRef.current!);
    !$s_selectedInboxThreadId && setInboxThreadContentDrawerOpen(false);
  }, [$s_selectedInboxThreadId]);

  useEffect(() => {
    return () => {
      clearInboxThreadOfferActionsTimeout();
      clearTimeout(changeInboxThreadBlockedFailedTimeoutRef.current!);
      clearTimeout(changeInboxThreadArchivedFailedTimeoutRef.current!);
      alertDialogService.close();
      loadingScreenOverlayService.close();
      fetchedInboxThreadOfferSource.current?.cancel &&
        fetchedInboxThreadOfferSource.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <InboxSlugContext.Provider
      value={{
        inboxThreadContentShow,
        inboxThreadSelectable,
        selectedInboxThreadIds,
        inboxThreadContentDrawerOpen,
        offerCreateFormModalOpen,
        offerUpdateFormModalOpen,
        inboxThreadReviewsFormDialogOpen,
        aiChatUserListTurnOffDialogOpen,
        aiChatUserListTurnOnDialogOpen,
        turnOffInboxThreadAiChatUsers,
        turnOnInboxThreadAiChatUsers,
        openInboxThreadContentShow,
        closeInboxThreadContentShow,
        deleteInboxThread,
        openGalleryDialog,
        removeAllSelectedInboxThreadId,
        addSelectedInboxThreadId,
        removeSelectedInboxThreadId,
        openInboxThreadSelectable,
        closeInboxThreadSelectable,
        changeSelectedInboxThreadId,
        closeInboxThreadContentDrawer,
        openOfferCreateFormModal,
        closeOfferCreateFormModal,
        openOfferUpdateFormModal,
        closeOfferUpdateFormModal,
        cancelInboxOffer,
        acceptInboxOffer,
        declineInboxOffer,
        changeInboxThreadBlocked,
        openInboxThreadReviewsFormDialog,
        closeInboxThreadReviewsFormDialog,
        changeInboxThreadArchived,
        openAiChatUserListTurnOffDialog,
        closeAiChatUserListTurnOffDialog,
        closeAiChatUserListTurnOnDialog,
        openAiChatUserListTurnOnDialog,
      }}
    >
      <FetchData />
      <InboxWebsocketListener />
      <div className={classes.root}>
        <AppContainer disableGutters>
          <div className={classes.inboxRelative}>
            <AppPaper className={classes.inboxRelativeContent}>
              <InboxThreadList />
              <InboxThreadContentDrawer />
            </AppPaper>
          </div>
        </AppContainer>
      </div>
      <OfferCreateFormModal />
      <OfferUpdateFormModal />
      <InboxThreadOfferStatusTracker
        onInboxThreadOfferStatusChange={clearInboxThreadOfferActionsTimeout}
      />
      <StyledInboxThreadReviewsFormDialog />
      <AiChatUserListTurnOffDialog />
      <AiChatUserListTurnOnDialog />
      <GalleryDialog
        open={galleryDialogOpen}
        items={galleryDialogItems}
        selectedItemIndex={galleryDialogSelectedItemIndex}
        onClose={handleGalleryDialogClose}
      />
    </InboxSlugContext.Provider>
  );
};

export default InboxSlug;
