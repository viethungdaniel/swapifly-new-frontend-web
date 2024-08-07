import axios from "axios";
import { bindActionCreators } from "redux";
import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { storeInboxAction, storeInboxSelectors } from "@/store";
import { imageHelpers, inboxHelpers, reduxHelpers } from "@/utils/helpers";
import { inboxConstants } from "@/utils/constants";

import { Box, Zoom } from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import InboxThreadMessageContent from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadMessageList/components/InboxThreadMessageContent";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLoading from "@/components/AppLoading";
import InboxThreadAiChatStatus from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadMessageList/components/InboxThreadAiChatStatus";

import ArrowTopScrollIcon from "@@/public/images/icons/arrow-top-scroll.svg";

import {
  useRef,
  useEffect,
  useContext,
  useState,
  forwardRef,
  memo,
  useMemo,
  useCallback,
} from "react";
import {
  useAppDispatch,
  useAppMomentWithLocale,
  useAppSelector,
  useDebouncedCallback,
  useEventCallback,
  useIsMounted,
  useIsomorphicLayoutEffect,
} from "@/hooks";

import InboxThreadMessageListContext from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadMessageList/InboxThreadMessageList.context";
import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

import useStyles from "./InboxThreadMessageList.styles";

import type { CancelTokenSource } from "axios";
import type {
  ListOnScrollProps,
  VariableSizeList as VariableSizeListRef,
} from "react-window";
import type { InboxThreadMessageListContextValue } from "@/views/InboxSlug/components/InboxThreadContent/components/InboxThreadMessageList/InboxThreadMessageList.context";

type InboxThreadMessageItemProps = {
  index: number;
  style: React.CSSProperties;
};

export const inboxAITypingLabels = [
  "sellerOffNow",
  "swapiflyAIIsServingYou",
  "swapiflyAIIsThinking",
];

const FETCHED_INBOX_THREAD_MESSAGES_LIMIT = 100;

const InboxThreadMessageContentMemo = memo(InboxThreadMessageContent, _isEqual);

const BottomScrollButton = () => {
  const { isScrolledBottom, scrollInboxThreadMessageListBottom } = useContext(
    InboxThreadMessageListContext
  );

  const { classes, theme } = useStyles();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const handleBottomScroll = () => {
    scrollInboxThreadMessageListBottom({ forced: true });
  };

  return (
    <Zoom
      in={!isScrolledBottom}
      timeout={transitionDuration}
      style={{
        transitionDelay: `${!isScrolledBottom ? transitionDuration.exit : 0}ms`,
      }}
    >
      <AppIconButton
        variant="contained"
        color="common.white"
        borderRadius="circular"
        className={classes.bottomScrollButton}
        onClick={handleBottomScroll}
      >
        <AppSvgIcon component={ArrowTopScrollIcon} fontSize="inherit" />
      </AppIconButton>
    </Zoom>
  );
};

const InboxThreadMessageListRoot = forwardRef(
  (
    props: React.ComponentPropsWithoutRef<"div">,
    ref: React.ForwardedRef<any>
  ) => {
    const { children, ...rest } = props;

    const { inboxThreadMessageListEndAnchorRef } = useContext(
      InboxThreadMessageListContext
    );

    const $s_inboxThreadOfferAutoReplyStatus = useAppSelector(
      (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_switch_status
    );

    const { classes } = useStyles();

    return (
      <div ref={ref} className={classes.inboxThreadMessageList} {...rest}>
        {$s_inboxThreadOfferAutoReplyStatus !==
          inboxConstants.INBOX_THREAD_AI_CHAT_DISABLED_TYPE && (
          <InboxThreadAiChatStatus
            className={classes.inboxThreadAiChatStatus}
          />
        )}
        <Box position="relative">{children}</Box>
        <Box
          ref={inboxThreadMessageListEndAnchorRef}
          position="absolute"
          bottom={0}
          left={0}
          width="100%"
          height={"1px"}
        />
      </div>
    );
  }
);

const InboxThreadMessageItem = memo((props: InboxThreadMessageItemProps) => {
  const {
    inboxRefreshing,
    inboxThreadAITyping,
    inboxAITypingLabelIndex,
    inboxThreadMessagesLoading,
    changeInboxThreadMessageItemSize,
    getInboxThreadMessageIndex,
  } = useContext(InboxThreadMessageListContext);
  const { openGalleryDialog } = useContext(InboxSlugContext);

  const { index, style } = props;

  const rootElRef = useRef<HTMLDivElement>(null!);

  const $s_inboxThreadMessages = useAppSelector(
    (state) => state.inbox.inboxThreadMessages
  );
  const $s_inboxThreadOfferUser = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferUser
  );
  const $s_inboxThreadOfferAutoReplyStatus = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_switch_status
  );
  const $s_authUser = useAppSelector((state) => state.auth.user);

  const inboxThreadMessageIndex = getInboxThreadMessageIndex(index);

  const previousInboxThreadMessage =
    $s_inboxThreadMessages[inboxThreadMessageIndex - 1];
  const inboxThreadMessage = $s_inboxThreadMessages[inboxThreadMessageIndex];
  const nextInboxThreadMessage =
    $s_inboxThreadMessages[inboxThreadMessageIndex + 1];
  const isStartInboxThreadMessage = inboxThreadMessageIndex === 0;
  const isEndInboxThreadMessage =
    inboxThreadMessageIndex === $s_inboxThreadMessages.length - 1;

  const { classes, cx } = useStyles();

  const handlePhotoOpen = (imgPathname: string) => {
    if (!imgPathname) return;
    const inboxThreadImages = $s_inboxThreadMessages.filter(
      (inboxThreadMessage) => {
        return inboxHelpers.isInboxThreadMessageContentImageType(
          inboxThreadMessage.c_type
        );
      }
    );
    const inboxThreadImageIndex = inboxThreadImages.findIndex(
      (inboxThreadImage) => inboxThreadImage.content === imgPathname
    );
    openGalleryDialog({
      items: inboxThreadImages.map((inboxThreadImage) => {
        const isMyThread =
          !!inboxThreadImage?.uid && inboxThreadImage?.uid === $s_authUser?.id;
        const inboxThreadMessageUser = isMyThread
          ? {
              id: $s_authUser?.id,
              nickname: $s_authUser?.nickname,
              username: $s_authUser?.username,
              avatar: $s_authUser?.avatar,
            }
          : {
              id: $s_inboxThreadOfferUser?.id,
              nickname: $s_inboxThreadOfferUser?.nickname,
              username: $s_inboxThreadOfferUser?.username,
              avatar: $s_inboxThreadOfferUser?.avatar,
            };

        return {
          src: imageHelpers.imagePathLoader(inboxThreadImage.content),
          title: inboxThreadMessageUser.nickname!,
          thumbnail: imageHelpers.imagePathLoader(inboxThreadImage.content),
          type: "image",
          shareData: {
            url: imageHelpers.imagePathLoader(inboxThreadImage.content),
          },
        };
      }),
      selectedItemIndex: inboxThreadImageIndex > -1 ? inboxThreadImageIndex : 0,
    });
  };

  useEffect(() => {
    const resizeObserverRoot = new ResizeObserver(async () => {
      if (!!rootElRef.current) {
        const rootHeight = rootElRef.current.getBoundingClientRect().height;
        changeInboxThreadMessageItemSize(index, rootHeight);
      }
    });

    rootElRef.current && resizeObserverRoot.observe(rootElRef.current);
    return () => {
      resizeObserverRoot.disconnect();
    };
  }, [changeInboxThreadMessageItemSize]);

  const inboxItemStyle = {
    ...style,
    height: "auto",
  } as React.CSSProperties;

  return (
    <div
      className={cx(
        !inboxThreadMessagesLoading && inboxRefreshing && classes.hidden
      )}
      ref={rootElRef}
      style={inboxItemStyle}
    >
      {inboxThreadMessageIndex < 0 ? (
        <>
          {inboxThreadMessagesLoading &&
          index ===
            ($s_inboxThreadOfferAutoReplyStatus !==
            inboxConstants.INBOX_THREAD_AI_CHAT_DISABLED_TYPE
              ? 1
              : 0) ? (
            <div className={classes.inboxThreadMessageItemLoading}>
              <AppLoading variant="circular" size={24} />
            </div>
          ) : (
            <InboxThreadAiChatStatus
              className={classes.inboxThreadAiChatStatusReplacement}
            />
          )}
        </>
      ) : (
        <InboxThreadMessageContentMemo
          inboxThreadMessageIndex={inboxThreadMessageIndex}
          isStartInboxThreadMessage={isStartInboxThreadMessage}
          isEndInboxThreadMessage={isEndInboxThreadMessage}
          previousInboxThreadMessage={previousInboxThreadMessage}
          inboxThreadMessage={inboxThreadMessage}
          nextInboxThreadMessage={nextInboxThreadMessage}
          inboxThreadAITyping={inboxThreadAITyping}
          inboxAITypingLabelIndex={inboxAITypingLabelIndex}
          onPhotoOpen={handlePhotoOpen}
        />
      )}
    </div>
  );
}, _isEqual);

const renderInboxThreadItem = memo(
  (props: { index: number; style: React.CSSProperties }) => {
    const { index, style } = props;

    return <InboxThreadMessageItem style={style} index={index} />;
  },
  _isEqual
);

const InboxThreadMessageList = () => {
  const $s_selectedInboxThreadId = useAppSelector(
    (state) => state.inbox.selectedInboxThreadId
  );
  const $s_inboxThreadOfferAutoReplyStatus = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_switch_status
  );
  const $s_inboxThreadOfferAiChatTurnedOffSeconds = useAppSelector(
    (state) => state.inbox.inboxThreadOffer?.chat_auto_reply_resume_at
  );
  const $s_inboxThreadBuyer = useAppSelector(
    storeInboxSelectors.selectInboxThreadBuyer
  );

  const [inboxThreadMessagesPage, setInboxThreadMessagesPage] = useState(1);
  const [isScrolledBottom, setIsScrolledBottom] = useState(true);
  const [inboxRefreshing, setInboxRefreshing] = useState(true);
  const [inboxThreadAITyping, setInboxThreadAITyping] = useState(false);
  const [inboxAITypingLabelIndex, setInboxAITypingLabelIndex] = useState(-1);

  const variableSizeListRef = useRef<VariableSizeListRef<
    typeof $s_inboxThreadMessages
  > | null>(null);
  const infiniteLoaderRef = useRef<any>();
  const indexToInboxThreadItemSizeMap = useRef<{
    [index: number]: number;
  }>({});
  const inboxContainerElRef = useRef<HTMLDivElement>(null!);
  const inboxListElRef = useRef<HTMLDivElement>(null);
  const inboxThreadMessageListEndAnchorRef = useRef<HTMLDivElement>(null!);
  const fetchedInboxThreadMessagesSourceRef = useRef<CancelTokenSource | null>(
    null
  );
  const isScrollingRef = useRef(true);
  const inboxAITypingWatchDisabledRef = useRef(true);
  const prevInboxListAnchorHeightRef = useRef(0);

  const { momentWithLocale } = useAppMomentWithLocale();

  const dispatch = useAppDispatch();

  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  // const $s_inboxThreadMessagesCount = useAppSelector(
  //   (state) => state.inbox.inboxThreadMessagesCount
  // );
  const $s_inboxThreadMessages = useAppSelector(
    (state) => state.inbox.inboxThreadMessages
  );
  const $s_inboxThreadMessagesLoading = useAppSelector(
    (state) => state.inbox.inboxThreadMessagesLoading
  );
  const $s_inboxThreadMessagesError = useAppSelector(
    (state) => state.inbox.inboxThreadMessagesError
  );

  const inboxThreadMessagesLoading =
    !!$s_inboxThreadMessagesLoading || !!$s_inboxThreadMessagesError;
  const inboxThreadMessagesRefreshing = useMemo(() => {
    return inboxThreadMessagesPage === 1 && !!inboxThreadMessagesLoading;
  }, [inboxThreadMessagesPage, inboxThreadMessagesLoading]);

  const lastInboxThreadMessage = useMemo(() => {
    return $s_inboxThreadMessages[$s_inboxThreadMessages.length - 1];
  }, [$s_inboxThreadMessages[$s_inboxThreadMessages.length - 1]]);

  // const hasNextPage =
  //   inboxThreadMessagesPage * FETCHED_INBOX_THREAD_MESSAGES_LIMIT <
  //   $s_inboxThreadMessagesCount;
  const hasNextPage = false;

  const previousInboxThreadMessageItemCount =
    (!!inboxThreadMessagesLoading ? 1 : 0) +
    ($s_inboxThreadOfferAutoReplyStatus !==
    inboxConstants.INBOX_THREAD_AI_CHAT_DISABLED_TYPE
      ? 0
      : 0);
  const nextInboxThreadMessageItemCount = inboxThreadAITyping ? 1 : 0;
  const variableSizeListItemCount =
    $s_inboxThreadMessages.length +
    previousInboxThreadMessageItemCount +
    nextInboxThreadMessageItemCount;

  const { classes } = useStyles();

  const fetchInboxThreadMessages = async (payload?: {
    params?: {
      page?: number;
    };
    meta?: {
      isReset?: boolean;
      isLoadMore?: boolean;
    };
  }) => {
    const { params, meta } = payload || {};

    fetchedInboxThreadMessagesSourceRef.current?.cancel &&
      fetchedInboxThreadMessagesSourceRef.current.cancel();
    fetchedInboxThreadMessagesSourceRef.current = axios.CancelToken.source();

    await reduxHelpers.callActionWithPromise(
      $s_inboxAction.fetchInboxThreadMessagesSaga,
      {
        params: {
          inbox_thread_id: $s_selectedInboxThreadId!,
          page: inboxThreadMessagesPage,
          ...params,
          limit: FETCHED_INBOX_THREAD_MESSAGES_LIMIT,
        },
        cancelToken: fetchedInboxThreadMessagesSourceRef.current.token,
      },
      {
        isReset: meta?.isReset,
        isLoadMore: meta?.isLoadMore,
      }
    );
    if (!isMounted()) return;
    inboxAITypingWatchDisabledRef.current = false;
    fetchedInboxThreadMessagesSourceRef.current = null;
  };

  const scrollInboxThreadMessageListBottom = useEventCallback(((options?: {
    forced: boolean;
  }) => {
    if (isScrolledBottom || !!options?.forced) {
      isScrollingRef.current = true;
      inboxThreadMessageListEndAnchorRef.current &&
        inboxThreadMessageListEndAnchorRef.current.scrollIntoView();
    }
    if (!!options?.forced) setIsScrolledBottom(true);
  }) as InboxThreadMessageListContextValue["scrollInboxThreadMessageListBottom"]);

  const closeInboxRefreshing = useEventCallback(() => {
    setInboxRefreshing(false);
  });

  const debounceCloseInboxRefreshing = useDebouncedCallback(
    closeInboxRefreshing,
    250
  );

  const changeInboxThreadMessageItemSize = useCallback(
    (index: number, size: number) => {
      const curIndexToInboxThreadItemSize =
        indexToInboxThreadItemSizeMap.current[index];
      indexToInboxThreadItemSizeMap.current = {
        ...indexToInboxThreadItemSizeMap.current,
        [index]: size,
      };
      debounceCloseInboxRefreshing();
      if (
        !variableSizeListRef.current ||
        (typeof curIndexToInboxThreadItemSize !== "undefined" &&
          curIndexToInboxThreadItemSize === size)
      )
        return;
      variableSizeListRef.current.resetAfterIndex(index);
    },
    []
  );

  const handleLoadMoreInboxThreadMessages =
    !!inboxThreadMessagesLoading || !hasNextPage
      ? () => {}
      : async () => {
          const newInboxThreadMessagesPage = inboxThreadMessagesPage + 1;
          setInboxThreadMessagesPage(newInboxThreadMessagesPage);
          await fetchInboxThreadMessages({
            params: {
              page: newInboxThreadMessagesPage,
            },
            meta: {
              isLoadMore: true,
            },
          });
        };

  const handleVariableSizeListScroll = (_: ListOnScrollProps) => {
    if (isScrollingRef.current) {
      isScrollingRef.current = false;
      return;
    }
    const inboxContainerEl = inboxContainerElRef.current;
    if (!!inboxContainerEl) {
      const inboxContainerElScrollHeight = inboxContainerEl.scrollHeight;
      const inboxContainerElScrollTop = inboxContainerEl.scrollTop;
      const inboxContainerElClientHeight = inboxContainerEl.clientHeight;
      const newIsScrolledBottom =
        inboxContainerElScrollHeight -
          (inboxContainerElScrollTop + inboxContainerElClientHeight) <=
          2 ||
        inboxContainerElScrollTop + inboxContainerElClientHeight >=
          inboxContainerElScrollHeight;
      if (!newIsScrolledBottom) {
        prevInboxListAnchorHeightRef.current = 0;
      }
      setIsScrolledBottom(newIsScrolledBottom);
    } else setIsScrolledBottom(false);
  };

  const isThreadContentLoaded = (index: number) => {
    return !hasNextPage || index > 0 || isScrolledBottom;
  };

  const getItemSize = (index: number) => {
    return indexToInboxThreadItemSizeMap.current[index] ?? 50;
  };

  const getInboxThreadMessageIndex: InboxThreadMessageListContextValue["getInboxThreadMessageIndex"] =
    (variableSizeListIndex) => {
      return variableSizeListIndex - previousInboxThreadMessageItemCount;
    };

  const updateInboxThreadAITyping = useEventCallback(() => {
    if (inboxAITypingWatchDisabledRef.current) {
      setInboxThreadAITyping(false);
      return;
    }
    if (!!lastInboxThreadMessage?.is_sending) return;
    let inboxThreadOfferAiChatTurnedOffSecondsWithNowDiffSeconds = 0;
    if (!!$s_inboxThreadOfferAiChatTurnedOffSeconds) {
      const now = momentWithLocale();
      const inboxThreadOfferAiChatTurnedOffSecondsWithMoment = momentWithLocale(
        $s_inboxThreadOfferAiChatTurnedOffSeconds,
        "X"
      );
      inboxThreadOfferAiChatTurnedOffSecondsWithNowDiffSeconds =
        inboxThreadOfferAiChatTurnedOffSecondsWithMoment.diff(now, "seconds");
    }
    if (
      !!lastInboxThreadMessage &&
      !lastInboxThreadMessage.is_error &&
      lastInboxThreadMessage.uid === $s_inboxThreadBuyer?.id &&
      inboxHelpers.isInboxThreadNormalMessageType(
        lastInboxThreadMessage.type
      ) &&
      ($s_inboxThreadOfferAutoReplyStatus ===
        inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE ||
        ($s_inboxThreadOfferAutoReplyStatus ===
          inboxConstants.INBOX_THREAD_AI_CHAT_OFF_TYPE &&
          inboxThreadOfferAiChatTurnedOffSecondsWithNowDiffSeconds < 1))
    ) {
      setInboxThreadAITyping(true);
    } else {
      setInboxThreadAITyping(false);
    }
  });

  useEffect(() => {
    setInboxThreadMessagesPage(1);
    setIsScrolledBottom(true);
    setInboxRefreshing(true);
    indexToInboxThreadItemSizeMap.current = {};
    isScrollingRef.current = true;
    inboxAITypingWatchDisabledRef.current = true;
    prevInboxListAnchorHeightRef.current = 0;
    fetchInboxThreadMessages({
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchedInboxThreadMessagesSourceRef.current?.cancel &&
        fetchedInboxThreadMessagesSourceRef.current.cancel();
    };
  }, [$s_selectedInboxThreadId]);

  useEffect(() => {
    updateInboxThreadAITyping();
  }, [
    lastInboxThreadMessage,
    $s_inboxThreadOfferAutoReplyStatus,
    $s_inboxThreadOfferAiChatTurnedOffSeconds,
  ]);

  useEffect(() => {
    let activeInboxAITypingLabelEffectTimeout;
    setInboxAITypingLabelIndex(-1);
    if (!!inboxThreadAITyping) {
      setInboxAITypingLabelIndex(0);
      const activeInboxAITypingLabelEffect = () => {
        setInboxAITypingLabelIndex((prevInboxAITypingLabelIndex) => {
          return prevInboxAITypingLabelIndex === inboxAITypingLabels.length - 1
            ? inboxAITypingLabels.length - 1
            : prevInboxAITypingLabelIndex + 1;
        });
        activeInboxAITypingLabelEffectTimeout = setTimeout(
          activeInboxAITypingLabelEffect,
          1500
        );
      };
      activeInboxAITypingLabelEffectTimeout = setTimeout(
        activeInboxAITypingLabelEffect,
        1500
      );
    }
    return () => {
      clearTimeout(activeInboxAITypingLabelEffectTimeout!);
    };
  }, [inboxThreadAITyping]);

  useIsomorphicLayoutEffect(() => {
    let scrolledInboxThreadMessageListBottomTimeout: ReturnType<
      typeof setTimeout
    >;

    const resizeInboxListObserver: ResizeObserverCallback = (entries) => {
      for (const entry of entries) {
        const inboxListAnchorHeight = entry.borderBoxSize?.[0].blockSize;
        if (
          typeof inboxListAnchorHeight === "number" &&
          inboxListAnchorHeight !== prevInboxListAnchorHeightRef.current
        ) {
          prevInboxListAnchorHeightRef.current = inboxListAnchorHeight;
          clearTimeout(scrolledInboxThreadMessageListBottomTimeout!);
          scrolledInboxThreadMessageListBottomTimeout = setTimeout(() => {
            if (!isMounted()) return;
            scrollInboxThreadMessageListBottom();
          }, 0);
        }
      }
    };

    const inboxListObserver = new ResizeObserver(resizeInboxListObserver);
    inboxListElRef.current && inboxListObserver.observe(inboxListElRef.current);
    return () => {
      inboxListObserver.disconnect();
    };
  });

  const isMounted = useIsMounted();

  return (
    <InboxThreadMessageListContext.Provider
      value={{
        inboxRefreshing,
        inboxThreadMessagesRefreshing,
        isScrolledBottom,
        inboxAITypingLabelIndex,
        inboxThreadAITyping,
        inboxThreadMessagesLoading,
        inboxThreadMessageListEndAnchorRef,
        changeInboxThreadMessageItemSize,
        scrollInboxThreadMessageListBottom,
        getInboxThreadMessageIndex,
      }}
    >
      <div className={classes.root}>
        <InfiniteLoader
          ref={infiniteLoaderRef}
          isItemLoaded={isThreadContentLoaded}
          threshold={2}
          itemCount={variableSizeListItemCount}
          loadMoreItems={handleLoadMoreInboxThreadMessages}
        >
          {({ onItemsRendered, ref }) => (
            <AutoSizer>
              {({ height, width }) => (
                <VariableSizeList
                  useIsScrolling
                  itemData={$s_inboxThreadMessages}
                  itemCount={variableSizeListItemCount}
                  height={height}
                  width={width}
                  ref={(_variableSizeListRef) => {
                    variableSizeListRef.current = _variableSizeListRef;
                    ref(_variableSizeListRef);
                  }}
                  layout={"vertical"}
                  overscanCount={4}
                  outerRef={inboxContainerElRef}
                  innerRef={inboxListElRef}
                  itemKey={(index, data) => {
                    const inboxThreadMessageIndex =
                      getInboxThreadMessageIndex(index);

                    return (
                      data[inboxThreadMessageIndex]?.id ||
                      data[inboxThreadMessageIndex]?.fe_id ||
                      `index-${inboxThreadMessageIndex}`
                    );
                  }}
                  innerElementType={InboxThreadMessageListRoot}
                  itemSize={getItemSize}
                  onItemsRendered={(props) => {
                    if (!inboxThreadMessagesRefreshing) {
                      onItemsRendered(props);
                    }
                  }}
                  onScroll={handleVariableSizeListScroll}
                >
                  {renderInboxThreadItem}
                </VariableSizeList>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
        <div className={classes.bottomRightActions}>
          <BottomScrollButton />
        </div>
      </div>
    </InboxThreadMessageListContext.Provider>
  );
};

export default InboxThreadMessageList;
