import { bindActionCreators } from "redux";
import axios from "axios";
import _take from "lodash/take";
import _isEqual from "lodash/isEqual";

import { inboxConstants } from "@/utils/constants";
import {
  adHelpers,
  imageHelpers,
  inboxHelpers,
  productHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import { storeInboxAction, storeInboxSelectors } from "@/store";

import { Box, Divider, Skeleton } from "@mui/material";
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList } from "react-window";
import InfiniteLoader from "react-window-infinite-loader";
import AppListItemButton from "@/components/AppListItemButton";
import AppAvatar from "@/components/AppAvatar";
import AppTypography from "@/components/AppTypography";
import AppChip from "@/components/AppChip";
import AppImage from "@/components/AppImage";
import AppListItem from "@/components/AppListItem";
import InboxToolbar from "@/views/InboxSlug/components/InboxToolbar";
import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import NoSearchResults from "@/components/NoSearchResults";
import AppCheckbox from "@/components/AppCheckbox";
import AppList from "@/components/AppList";
import InboxThreadLatestTime from "@/views/InboxSlug/components/InboxThreadList/components/InboxThreadLatestTime";
import InboxThreadTypeSelect from "@/views/InboxSlug/components/InboxThreadList/components/InboxThreadTypeSelect";
import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";
import AppIconButton from "@/components/AppIconButton";
import AppTooltip from "@/components/AppTooltip";
import ArchiveButton from "@/views/InboxSlug/components/InboxThreadList/components/ArchiveButton";
import DeleteButton from "@/views/InboxSlug/components/InboxThreadList/components/DeleteButton";

import PhotoIcon from "@@/public/images/icons/photo.svg";

import CloseIcon from "@@/public/images/icons/close.svg";

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
  useAppSelector,
  useIsMounted,
  useIsomorphicLayoutEffect,
} from "@/hooks";
import { useTranslation } from "next-i18next";

import InboxThreadListContext from "@/views/InboxSlug/components/InboxThreadList/InboxThreadList.context";

import useStyles from "./InboxThreadList.styles";

import type { AppState } from "@/store";
import type { CancelTokenSource } from "axios";
import AppLink from "@/components/AppLink";
import { appGtagService } from "@/services";

type ItemProps = {
  index: number;
  style: React.CSSProperties;
};

type InboxThreadItemContentProps = {
  inboxThreadIndex: number;
  inboxThread?: AppState["inbox"]["inboxThreads"][number];
  loading?: boolean;
};

type InboxThreadAdItemContentProps = {
  index: number;
  inboxThreadsAd?: AppState["ad"]["inboxThreadsAds"][number];
};

const FETCHED_INBOXES_LIMIT = 16;

const InboxList = forwardRef(
  (
    props: React.ComponentPropsWithoutRef<"div">,
    ref: React.ForwardedRef<any>
  ) => {
    const { children, ...rest } = props;

    const { classes } = useStyles();

    return (
      <div ref={ref} {...rest} className={classes.inboxThreadList}>
        {children}
      </div>
    );
  }
);

export const InboxThreadItemContentEmpty = () => {
  const { classes } = useStyles();

  return (
    <AppListItem className={classes.inboxThreadItem}>
      <NoSearchResults variant="inbox" sx={{ width: "100%" }} />
    </AppListItem>
  );
};

export const InboxThreadItemContent = memo(
  (props: InboxThreadItemContentProps) => {
    const {
      inboxThreadSelectable,
      selectedInboxThreadIds,
      addSelectedInboxThreadId,
      removeSelectedInboxThreadId,
    } = useContext(InboxSlugContext);
    const { changeSelectedInboxThreadId } = useContext(InboxSlugContext);

    const { inboxThreadIndex, inboxThread, loading } = props;

    const $s_selectedInboxThreadId = useAppSelector(
      (state) => state.inbox.selectedInboxThreadId
    );

    const { t } = useTranslation();

    const { classes } = useStyles();

    const inboxThreadItemButtonTouchRippleRef = useRef<any>();
    const checkboxRef = useRef<HTMLButtonElement | null>(null);
    const inboxThreadListItemButtonRef = useRef<HTMLDivElement>(null!);

    const inboxThreadMessageStateItem =
      inboxConstants.inboxThreadMessageTypeToInboxThreadMessageStateItemMap[
        inboxThread?.latest_type as any
      ];

    const subMessage = useMemo(() => {
      if (inboxHelpers.isBuyer(inboxThread?.user_type!) && !!inboxThread?.price)
        return t("madeOfferPrice", {
          price: inboxThread?.price,
          currency: inboxThread?.currency,
        });
      if (inboxHelpers.isSeller(inboxThread?.user_type!) && inboxThread?.price)
        return t("offeredYouPrice", {
          price: inboxThread?.price,
          currency: inboxThread?.currency,
        });
      return "";
    }, [inboxThread?.user_type, inboxThread?.price, inboxThread?.currency, t]);

    const handleSelectedInboxThreadIdsChange = (
      event: React.MouseEvent<HTMLButtonElement>
    ) => {
      event.preventDefault();
      event.stopPropagation();
      if (!inboxThread?.id) return;
      if (selectedInboxThreadIds.includes(inboxThread?.id)) {
        removeSelectedInboxThreadId(inboxThread?.id);
      } else {
        addSelectedInboxThreadId(inboxThread.id);
      }
    };

    const handleInboxThreadDetailsOpen = (
      _: React.MouseEvent<HTMLDivElement>
    ) => {
      if (!inboxThread?.id) return;
      changeSelectedInboxThreadId(inboxThread.id);
    };

    const handleInboxThreadItemButtonRippleTouchStart = (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      if (
        checkboxRef.current &&
        checkboxRef.current.contains(event.target as HTMLElement)
      )
        return;
      inboxThreadItemButtonTouchRippleRef.current &&
        inboxThreadItemButtonTouchRippleRef.current.start(event);
    };

    const handleInboxThreadItemButtonRippleTouchEnd = (
      event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
    ) => {
      inboxThreadItemButtonTouchRippleRef.current &&
        inboxThreadItemButtonTouchRippleRef.current.stop(event);
    };

    const handleInboxThreadItemButtonTouchMove = (
      event: React.TouchEvent<HTMLDivElement>
    ) => {
      const touch = event.touches[0];
      if (
        inboxThreadListItemButtonRef.current &&
        !inboxThreadListItemButtonRef.current.contains(
          document.elementFromPoint(touch.pageX, touch.pageY)
        )
      ) {
        handleInboxThreadItemButtonRippleTouchEnd(event);
      }
    };

    return (
      <>
        {inboxThreadIndex !== 0 && (
          <AppListItem sx={{ minHeight: "auto", py: 0 }}>
            <Divider sx={{ flex: 1 }} />
          </AppListItem>
        )}
        <AppListItemButton
          ref={inboxThreadListItemButtonRef}
          className={classes.inboxThreadItem}
          disableTouchRipple
          selected={$s_selectedInboxThreadId === inboxThread?.id}
          touchRippleRef={inboxThreadItemButtonTouchRippleRef}
          onClick={handleInboxThreadDetailsOpen}
          onMouseDown={handleInboxThreadItemButtonRippleTouchStart}
          onMouseUp={handleInboxThreadItemButtonRippleTouchEnd}
          onMouseLeave={handleInboxThreadItemButtonRippleTouchEnd}
          onTouchStart={handleInboxThreadItemButtonRippleTouchStart}
          onTouchEnd={handleInboxThreadItemButtonRippleTouchEnd}
          onTouchMove={handleInboxThreadItemButtonTouchMove}
        >
          {!loading && inboxThreadSelectable && (
            <AppCheckbox
              ref={checkboxRef}
              color="text.primary"
              defaultCheckedIconColor="text.primary"
              edge={["start", "y"]}
              checked={selectedInboxThreadIds.includes(inboxThread?.id!)}
              onClick={handleSelectedInboxThreadIdsChange}
            />
          )}
          {!!loading ? (
            <Skeleton
              className={classes.inboxThreadItemAvatar}
              variant="circular"
              animation="wave"
            />
          ) : (
            <AppAvatar
              src={
                inboxThread?.avatar
                  ? imageHelpers.appImageLoader({
                      src: inboxThread?.avatar,
                    })
                  : undefined
              }
              className={classes.inboxThreadItemAvatar}
            />
          )}

          <div className={classes.inboxThreadItemText}>
            <div className={classes.inboxThreadItemTextSectionA}>
              <AppTypography
                variant={
                  !!inboxThread?.new_text?.isread ? "bodyReg16" : "bodySemi16"
                }
                color="text.primary"
                noWrap
                flex={1}
                title={inboxThread?.nickname ?? ""}
              >
                {!!loading ? (
                  <Skeleton variant="text" sx={{ width: "25%" }} />
                ) : (
                  inboxThread?.nickname
                )}
              </AppTypography>
              {!loading && (
                <AppTypography variant="captionReg12" color="text.secondary">
                  <InboxThreadLatestTime
                    latestTime={inboxThread?.latest_time ?? 0}
                  />
                </AppTypography>
              )}
            </div>
            <div className={classes.inboxThreadItemTextSectionB}>
              <Box flex={1} overflow="hidden">
                <AppTypography
                  variant={
                    !!inboxThread?.new_text?.isread ? "bodyReg14" : "bodyMed14"
                  }
                  color={
                    !!inboxThread?.new_text?.isread
                      ? "text.secondary"
                      : "text.primary"
                  }
                  noWrap
                  component="div"
                  {...(!loading &&
                  inboxHelpers.isInboxThreadMessageContentImageType(
                    inboxThread?.new_text?.c_type!
                  )
                    ? {
                        display: "flex",
                        flexWrap: "nowrap",
                        alignItems: "center",
                      }
                    : {})}
                  gap={0.5}
                  title={inboxThread?.new_text?.content ?? ""}
                >
                  {!!loading ? (
                    <Skeleton variant="text" sx={{ width: "100%" }} />
                  ) : inboxHelpers.isInboxThreadMessageContentImageType(
                      inboxThread?.new_text?.c_type!
                    ) ? (
                    <>
                      <AppSvgIcon
                        component={PhotoIcon}
                        color="inherit"
                        fontSize="small"
                        sx={{ ml: "-2px", my: "-2px" }}
                      />{" "}
                      <AppTypography variant="inherit" noWrap>
                        {t("image")}
                      </AppTypography>
                    </>
                  ) : (
                    inboxThread?.new_text?.content ?? <>&nbsp;</>
                  )}
                </AppTypography>
                <div className={classes.inboxThreadItemOffer}>
                  {!loading && !!inboxThreadMessageStateItem && (
                    <AppChip
                      borderRadius="circular"
                      variant="filled"
                      color={inboxThreadMessageStateItem.color}
                      size="small"
                      textColor={inboxThreadMessageStateItem.textColor}
                      label={inboxThreadMessageStateItem.label}
                      sx={{ mt: 0.5, textTransform: "uppercase" }}
                    />
                  )}

                  {loading ? (
                    <Skeleton variant="text" sx={{ width: "50%" }} />
                  ) : (
                    <AppTypography
                      variant="captionReg12"
                      color="text.secondary"
                      noWrap
                      title={subMessage}
                    >
                      {subMessage}
                    </AppTypography>
                  )}
                </div>
              </Box>
              <div className={classes.inboxThreadItemProductImage}>
                {!!loading ? (
                  <Skeleton
                    variant="rounded"
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "inherit",
                    }}
                  />
                ) : (
                  <>
                    <AppImage
                      src={inboxThread?.p_image ?? ""}
                      loader={imageHelpers.appImageLoader}
                      fill
                      objectFit="cover"
                      objectPosition="center"
                    />
                    {productHelpers.isSoldProduct(inboxThread?.p_state!) && (
                      <AppTypography
                        variant="captionReg10"
                        className={classes.inboxThreadItemProductSoldTag}
                      >
                        {t("sold")}
                      </AppTypography>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </AppListItemButton>
      </>
    );
  },
  _isEqual
);

export const InboxThreadAdItemContent = memo(
  (props: InboxThreadAdItemContentProps) => {
    const { index, inboxThreadsAd } = props;

    const { t } = useTranslation();

    const { classes } = useStyles();

    const handleInboxThreadsAdClick = () => {
      !!inboxThreadsAd &&
        appGtagService.dispatchInboxThreadsAdClickEvent({
          adRefName: inboxThreadsAd.ref_tilte,
        });
    };

    return (
      <>
        {index !== 0 && (
          <AppListItem sx={{ minHeight: "auto", py: 0 }}>
            <Divider sx={{ flex: 1 }} />
          </AppListItem>
        )}
        <AppListItemButton
          className={classes.inboxThreadAdItem}
          disableTouchRipple
          component={AppLink}
          {...adHelpers.getAdLink(inboxThreadsAd)}
          onClick={handleInboxThreadsAdClick}
        >
          <AppAvatar
            src={
              inboxThreadsAd?.ad_publisher?.avatar
                ? imageHelpers.appImageLoader({
                    src: inboxThreadsAd?.ad_publisher?.avatar,
                  })
                : undefined
            }
            className={classes.inboxThreadItemAvatar}
            sx={(theme) => ({
              bgcolor: theme.palette.common.blue,
              color: theme.palette.common.white,
            })}
          >
            AD
          </AppAvatar>

          <div className={classes.inboxThreadItemText}>
            <div className={classes.inboxThreadItemTextSectionA}>
              <AppTypography
                variant={"bodySemi16"}
                color="text.primary"
                noWrap
                flex={1}
                title={inboxThreadsAd?.title ?? ""}
              >
                {inboxThreadsAd?.title || (
                  <AppTypography
                    variant="inherit"
                    component="span"
                    color="common.blue"
                  >
                    {t("sponsorAd")}
                  </AppTypography>
                )}
              </AppTypography>
              <AppTypography
                variant="captionReg12"
                color="text.secondary"
                display="flex"
              >
                <AppTypography
                  variant="inherit"
                  component="span"
                  color="common.white"
                  bgcolor="common.blue"
                  height={16}
                  lineHeight={"16px"}
                  px={"2px"}
                  borderRadius="2px"
                >
                  AD
                </AppTypography>
              </AppTypography>
            </div>
            <div className={classes.inboxThreadItemTextSectionB}>
              <Box flex={1} overflow="hidden">
                {!!inboxThreadsAd?.description && (
                  <AppTypography
                    variant={"bodyReg14"}
                    color={"text.secondary"}
                    noWrap
                    component="div"
                    gap={0.5}
                    title={inboxThreadsAd?.description ?? ""}
                  >
                    {inboxThreadsAd?.description}
                  </AppTypography>
                )}
                <AppTypography
                  variant="captionMed12"
                  color="common.blue"
                  className={classes.inboxThreadItemOffer}
                >
                  {t("viewMore")}
                </AppTypography>
              </Box>
              <div className={classes.inboxThreadItemProductImage}>
                {adHelpers.isAdVideoMediaType(inboxThreadsAd?.type) ? (
                  <video
                    className={classes.inboxThreadAdItemVideo}
                    playsInline
                    loop
                    autoPlay
                    muted
                  >
                    <source
                      src={imageHelpers.imagePathLoader(inboxThreadsAd?.video)}
                    />
                  </video>
                ) : (
                  <AppImage
                    src={inboxThreadsAd?.photo ?? ""}
                    loader={imageHelpers.appImageLoader}
                    fill
                    objectFit="cover"
                    objectPosition="center"
                  />
                )}
              </div>
            </div>
          </div>
        </AppListItemButton>
      </>
    );
  },
  _isEqual
);

const InboxThreadItem = memo((props: ItemProps) => {
  const { changeInboxThreadItemSize } = useContext(InboxThreadListContext);

  const { index, style } = props;

  const rootElRef = useRef<HTMLUListElement>(null!);

  const $s_adWithInboxThreads = useAppSelector(
    storeInboxSelectors.selectAdWithInboxThreads
  );
  const $s_inboxThreadsLoading = useAppSelector(
    (state) => state.inbox.inboxThreadsLoading
  );

  const adWithInboxThread = $s_adWithInboxThreads[index];

  const inboxThreadItemStyle = {
    ...style,
    height: "auto",
  };

  useIsomorphicLayoutEffect(() => {
    const rootEl = rootElRef.current;

    const resizeObserverRoot = new ResizeObserver(() => {
      if (!!rootEl) {
        const rootHeight = rootEl.getBoundingClientRect().height;
        changeInboxThreadItemSize(index, rootHeight);
      }
    });
    rootEl && resizeObserverRoot.observe(rootEl);
    return () => {
      resizeObserverRoot.disconnect();
    };
  });

  return (
    <AppList ref={rootElRef} style={inboxThreadItemStyle} disablePadding>
      {!!adWithInboxThread?.inboxThread && (
        <InboxThreadItemContent
          inboxThreadIndex={index}
          inboxThread={adWithInboxThread.inboxThread!}
        />
      )}
      {!!adWithInboxThread?.inboxThreadsAd && (
        <InboxThreadAdItemContent
          index={index}
          inboxThreadsAd={adWithInboxThread.inboxThreadsAd!}
        />
      )}
      {!adWithInboxThread && $s_inboxThreadsLoading && (
        <InboxThreadItemContent inboxThreadIndex={index} loading />
      )}
      {!adWithInboxThread &&
        $s_adWithInboxThreads.length < 1 &&
        !$s_inboxThreadsLoading && <InboxThreadItemContentEmpty />}
    </AppList>
  );
}, _isEqual);

const renderInboxThreadItem = memo(
  (props: { index: number; style: React.CSSProperties }) => {
    const { index, style } = props;

    return <InboxThreadItem style={style} index={index} />;
  },
  _isEqual
);

const InboxThreadList = () => {
  const {
    inboxThreadSelectable,
    removeAllSelectedInboxThreadId,
    openInboxThreadSelectable,
    closeInboxThreadSelectable,
  } = useContext(InboxSlugContext);

  const [inboxThreadsPage, setInboxThreadsPage] = useState(1);

  const variableSizeListRef = useRef<any>();
  const infiniteLoaderRef = useRef<any>();
  const indexToInboxThreadItemSizeMap = useRef<{
    [index: number]: number;
  }>({});
  const inboxListRef = useRef<HTMLLIElement>(null!);
  const fetchedInboxThreadsSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  // const $s_inboxThreadsCount = useAppSelector(
  //   (state) => state.inbox.inboxThreadsCount
  // );
  const $s_inboxThreadsLoading = useAppSelector(
    (state) => state.inbox.inboxThreadsLoading
  );
  const $s_selectedInboxThreadType = useAppSelector(
    (state) => state.inbox.selectedInboxThreadType
  );
  const $s_adWithInboxThreads = useAppSelector(
    storeInboxSelectors.selectAdWithInboxThreads
  );

  // const hasNextPage =
  //   inboxThreadsPage * FETCHED_INBOXES_LIMIT < $s_inboxThreadsCount;
  const hasNextPage = false;
  const variableSizeListItemCount =
    inboxThreadsPage === 1 && (hasNextPage || !!$s_inboxThreadsLoading)
      ? $s_adWithInboxThreads.length + FETCHED_INBOXES_LIMIT
      : hasNextPage || !!$s_inboxThreadsLoading
      ? $s_adWithInboxThreads.length + 1
      : $s_adWithInboxThreads.length < 1
      ? 1
      : $s_adWithInboxThreads.length;

  const { t } = useTranslation();

  const { classes } = useStyles();

  const fetchInboxThreads = async (payload?: {
    params?: {
      page?: number;
      type?: number;
    };
    meta?: {
      isReset?: boolean;
      isLoadMore?: boolean;
    };
  }) => {
    const { params, meta } = payload || {};

    fetchedInboxThreadsSourceRef.current?.cancel &&
      fetchedInboxThreadsSourceRef.current.cancel();
    fetchedInboxThreadsSourceRef.current = axios.CancelToken.source();

    await reduxHelpers.callActionWithPromise(
      $s_inboxAction.fetchInboxThreadsSaga,
      {
        params: {
          page: inboxThreadsPage,
          type: $s_selectedInboxThreadType!,
          ...params,
          limit: FETCHED_INBOXES_LIMIT,
        },
        cancelToken: fetchedInboxThreadsSourceRef.current.token,
      },
      {
        isReset: meta?.isReset,
        isLoadMore: meta?.isLoadMore,
      }
    );
    if (!isMounted()) return;
    fetchedInboxThreadsSourceRef.current = null;
  };

  const changeInboxThreadItemSize = useCallback(
    (index: number, size: number) => {
      indexToInboxThreadItemSizeMap.current = {
        ...indexToInboxThreadItemSizeMap.current,
        [index]: size,
      };
      variableSizeListRef.current.resetAfterIndex(index);
    },
    []
  );

  const changeInboxThreadsType = (inboxThreadType: number) => {
    $s_inboxAction.setSelectedInboxThreadType(inboxThreadType);
    removeAllSelectedInboxThreadId();
    setInboxThreadsPage(1);
    fetchInboxThreads({
      params: {
        page: 1,
        type: inboxThreadType,
      },
      meta: {
        isReset: true,
      },
    });
  };

  const handleLoadMoreInboxThreads =
    !!$s_inboxThreadsLoading || !hasNextPage
      ? () => {}
      : async () => {
          const newInboxThreadsPage = inboxThreadsPage + 1;
          setInboxThreadsPage(newInboxThreadsPage);
          await fetchInboxThreads({
            params: {
              page: newInboxThreadsPage,
            },
            meta: {
              isLoadMore: true,
            },
          });
        };

  const isInboxLoaded = (index: number) => {
    return !hasNextPage || index < $s_adWithInboxThreads.length;
  };

  const getItemSize = (index: number) => {
    return indexToInboxThreadItemSizeMap.current[index] ?? 118;
  };

  useEffect(() => {
    if (!isMounted()) return;
    infiniteLoaderRef.current &&
      infiniteLoaderRef.current.resetloadMoreItemsCache();
  }, [$s_adWithInboxThreads]);

  const isMounted = useIsMounted();

  useEffect(() => {
    fetchInboxThreads({
      meta: {
        isReset: true,
      },
    });
    return () => {
      fetchedInboxThreadsSourceRef.current?.cancel &&
        fetchedInboxThreadsSourceRef.current.cancel();
    };
  }, []);

  return (
    <InboxThreadListContext.Provider
      value={{
        changeInboxThreadItemSize,
        changeInboxThreadsType,
      }}
    >
      <InfiniteLoader
        ref={infiniteLoaderRef}
        isItemLoaded={isInboxLoaded}
        threshold={2}
        itemCount={variableSizeListItemCount}
        loadMoreItems={handleLoadMoreInboxThreads}
      >
        {({ onItemsRendered, ref }) => (
          <div className={classes.root}>
            <InboxToolbar>
              <InboxThreadTypeSelect />
              <Box flex={1} />
              {inboxThreadSelectable &&
                !$s_inboxThreadsLoading &&
                $s_adWithInboxThreads.length > 0 && (
                  <>
                    <Box display="flex" component="span" mr={1.25}>
                      <ArchiveButton />
                    </Box>
                    <Box display="flex" component="span" mr={1.25}>
                      <DeleteButton />
                    </Box>
                    <AppTooltip title={t("cancel")}>
                      <Box display="flex" component="span">
                        <AppIconButton
                          variant="text"
                          size="small"
                          color="text.primary"
                          edge={["y", "end"]}
                          onClick={closeInboxThreadSelectable}
                        >
                          <AppSvgIcon
                            component={CloseIcon}
                            fontSize="inherit"
                          />
                        </AppIconButton>
                      </Box>
                    </AppTooltip>
                  </>
                )}
              {!inboxThreadSelectable &&
                !$s_inboxThreadsLoading &&
                $s_adWithInboxThreads.length > 0 && (
                  <AppButton
                    noWrap
                    variant="text"
                    size="small"
                    color="text.primary"
                    edge="xy"
                    onClick={openInboxThreadSelectable}
                  >
                    {t("select")}
                  </AppButton>
                )}
            </InboxToolbar>
            <div className={classes.inboxThread}>
              <AutoSizer>
                {({ height, width }) => (
                  <VariableSizeList
                    itemData={$s_adWithInboxThreads}
                    itemCount={variableSizeListItemCount}
                    height={height}
                    width={width}
                    ref={(_variableSizeListRef) => {
                      variableSizeListRef.current = _variableSizeListRef;
                      ref(_variableSizeListRef);
                    }}
                    layout={"vertical"}
                    overscanCount={4}
                    innerRef={inboxListRef}
                    itemKey={(index, data) =>
                      data[index]?.inboxThread?.id
                        ? `inboxThread-${data[index]?.inboxThread?.id}`
                        : data[index]?.inboxThreadsAd?.id
                        ? `inboxThread-${data[index]?.inboxThreadsAd?.id}`
                        : index
                    }
                    innerElementType={InboxList}
                    itemSize={getItemSize}
                    onItemsRendered={onItemsRendered}
                  >
                    {renderInboxThreadItem}
                  </VariableSizeList>
                )}
              </AutoSizer>
            </div>
          </div>
        )}
      </InfiniteLoader>
    </InboxThreadListContext.Provider>
  );
};

export default InboxThreadList;
