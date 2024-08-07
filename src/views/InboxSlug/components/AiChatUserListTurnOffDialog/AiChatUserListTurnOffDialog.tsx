import _isEqual from "lodash/isEqual";
import axios from "axios";
import { bindActionCreators } from "redux";

import { commonHelpers, imageHelpers } from "@/utils/helpers";
import { inboxConstants } from "@/utils/constants";
import { storeInboxSelectors, storeUserAction } from "@/store";

import AppAvatar from "@/components/AppAvatar";
import AppButton from "@/components/AppButton";
import AppCheckbox from "@/components/AppCheckbox";
import AppDialog from "@/components/AppDialog";
import AppDialogActions from "@/components/AppDialogActions";
import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemIcon from "@/components/AppListItemIcon";
import AppListItemText from "@/components/AppListItemText";
import { VariableSizeList } from "react-window";
import { Box, Divider, Grid } from "@mui/material";
import InfiniteLoader from "react-window-infinite-loader";
import AppLoading from "@/components/AppLoading";
import AppLink from "@/components/AppLink";

import { useTranslation } from "next-i18next";
import {
  forwardRef,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useAppDispatch, useAppSelector, useEventCallback } from "@/hooks";

import AiChatUserListTurnOffDialogContext from "@/views/InboxSlug/components/AiChatUserListTurnOffDialog/AiChatUserListTurnOffDialog.context";
import InboxSlugContext from "@/views/InboxSlug/InboxSlug.context";

import useStyles from "./AiChatUserListTurnOffDialog.styles";

import type { AppState } from "@/store";
import type { CancelTokenSource } from "axios";
import type { AiChatUserListTurnOffDialogContextValue } from "@/views/InboxSlug/components/AiChatUserListTurnOffDialog/AiChatUserListTurnOffDialog.context";
import type { AppCheckboxProps } from "@/components/AppCheckbox";

type UserItemContentProps = {
  inboxThreadOfferProductAiChatUser?: AppState["user"]["inboxThreadOfferProductAiChatUsers"][number];
  checkboxChecked?: boolean;
  onCheckboxChange?: AppCheckboxProps["onChange"];
};

type UserItemHeaderProps = {
  checkboxHidden?: boolean;
  checkboxChecked?: boolean;
  checkboxIndeterminate?: boolean;
  onCheckboxChange?: AppCheckboxProps["onChange"];
};

const INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_LIMIT = 8;

const UserItemNoResults = memo(() => {
  const { t } = useTranslation();

  return (
    <AppListItem sx={{ px: 0 }}>
      <AppListItemText
        primary={t("noResults")}
        primaryTypographyProps={{
          color: "text.secondary",
          align: "center",
        }}
      />
    </AppListItem>
  );
}, _isEqual);

const UserItemLoading = memo(() => {
  return (
    <AppListItem sx={{ px: 0, justifyContent: "center" }}>
      <AppLoading size={28} />
    </AppListItem>
  );
}, _isEqual);

const UserItemContent = memo((props: UserItemContentProps) => {
  const {
    inboxThreadOfferProductAiChatUser,
    checkboxChecked,
    onCheckboxChange,
  } = props;

  const { classes } = useStyles();

  return (
    <AppListItem className={classes.userItem} sx={{ px: 0 }}>
      <AppListItemIcon>
        <AppAvatar
          component={AppLink}
          href={`/${commonHelpers.generateUserSlug(
            inboxThreadOfferProductAiChatUser
          )}`}
          underline="none"
          hoverColor="none"
          src={
            !!inboxThreadOfferProductAiChatUser?.avatar
              ? imageHelpers.appImageLoader({
                  src: inboxThreadOfferProductAiChatUser?.avatar,
                })
              : undefined
          }
        />
      </AppListItemIcon>
      <AppListItemText
        primary={
          <AppLink
            href={`/${commonHelpers.generateUserSlug(
              inboxThreadOfferProductAiChatUser
            )}`}
            variant="inherit"
          >
            {inboxThreadOfferProductAiChatUser?.nickname}
          </AppLink>
        }
      />
      <AppCheckbox
        edge="end"
        checked={checkboxChecked}
        defaultCheckedIconColor="text.primary"
        color="text.primary"
        onChange={onCheckboxChange}
      />
    </AppListItem>
  );
}, _isEqual);

const UserItemHeader = memo((props: UserItemHeaderProps) => {
  const {
    checkboxHidden,
    checkboxIndeterminate,
    checkboxChecked,
    onCheckboxChange,
  } = props;

  const { t } = useTranslation();

  return (
    <AppListItem sx={{ px: 0 }}>
      <AppListItemText
        primary={t("selectUser")}
        primaryTypographyProps={{
          color: "text.secondary",
        }}
      />
      {!checkboxHidden && (
        <AppCheckbox
          defaultCheckedIconColor="text.primary"
          color="text.primary"
          indeterminate={checkboxIndeterminate}
          edge="end"
          checked={checkboxChecked}
          onChange={onCheckboxChange}
        />
      )}
    </AppListItem>
  );
}, _isEqual);

const UserItem = memo((props: any) => {
  const {
    selectedInboxThreadOfferProductAiChatUserIds,
    inboxThreadOfferProductAiChatUsersLoading,
    changeUserItemSize,
    addAllInboxThreadOfferProductAiChatUserIds,
    removeAllInboxThreadOfferProductAiChatUserIds,
    toggleInboxThreadOfferProductAiChatUserId,
  } = useContext(AiChatUserListTurnOffDialogContext);

  const { index, style } = props;

  const inboxThreadOfferProductAiChatUserIndex = index - 1;

  const rootElRef = useRef<HTMLDivElement>(null!);

  const $s_inboxThreadOfferProductAiChatUsers = useAppSelector(
    (state) => state.user.inboxThreadOfferProductAiChatUsers
  );

  const inboxThreadOfferProductAiChatUser =
    $s_inboxThreadOfferProductAiChatUsers[
      inboxThreadOfferProductAiChatUserIndex
    ];

  const inboxItemStyle = {
    ...style,
    height: "auto",
  };

  const userItemHeaderCheckboxChecked =
    $s_inboxThreadOfferProductAiChatUsers.length ===
    selectedInboxThreadOfferProductAiChatUserIds.length;
  const userItemHeaderCheckboxIndeterminate =
    selectedInboxThreadOfferProductAiChatUserIds.length > 0 &&
    $s_inboxThreadOfferProductAiChatUsers.length !==
      selectedInboxThreadOfferProductAiChatUserIds.length;
  const userItemHeaderCheckboxHidden =
    $s_inboxThreadOfferProductAiChatUsers.length < 1;

  const userItemContentCheckboxChecked =
    selectedInboxThreadOfferProductAiChatUserIds.includes(
      inboxThreadOfferProductAiChatUser?.id
    );

  const handleUserItemContentCheckboxChange: UserItemContentProps["onCheckboxChange"] =
    () => {
      toggleInboxThreadOfferProductAiChatUserId(
        inboxThreadOfferProductAiChatUser?.id!
      );
    };

  const handleUserItemHeaderCheckboxChange: UserItemHeaderProps["onCheckboxChange"] =
    (event) => {
      if (event.target.checked) addAllInboxThreadOfferProductAiChatUserIds();
      else removeAllInboxThreadOfferProductAiChatUserIds();
    };

  useEffect(() => {
    const resizeObserverRoot = new ResizeObserver(async () => {
      if (!!rootElRef.current) {
        const rootHeight = rootElRef.current.getBoundingClientRect().height;
        changeUserItemSize(index, rootHeight);
      }
    });

    rootElRef.current && resizeObserverRoot.observe(rootElRef.current);
    return () => {
      resizeObserverRoot.disconnect();
    };
  }, []);

  return (
    <div ref={rootElRef} style={inboxItemStyle}>
      {index === 0 ? (
        <UserItemHeader
          checkboxChecked={userItemHeaderCheckboxChecked}
          checkboxIndeterminate={userItemHeaderCheckboxIndeterminate}
          checkboxHidden={userItemHeaderCheckboxHidden}
          onCheckboxChange={handleUserItemHeaderCheckboxChange}
        />
      ) : (
        <>
          {!inboxThreadOfferProductAiChatUser &&
            (inboxThreadOfferProductAiChatUsersLoading ? (
              <UserItemLoading />
            ) : (
              <UserItemNoResults />
            ))}
          {!!inboxThreadOfferProductAiChatUser && (
            <UserItemContent
              inboxThreadOfferProductAiChatUser={
                inboxThreadOfferProductAiChatUser
              }
              checkboxChecked={userItemContentCheckboxChecked}
              onCheckboxChange={handleUserItemContentCheckboxChange}
            />
          )}
        </>
      )}
    </div>
  );
}, _isEqual);

const UserList = forwardRef(
  (
    props: React.ComponentPropsWithoutRef<"ul">,
    ref: React.ForwardedRef<any>
  ) => {
    const { children, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <AppList
        ref={ref}
        {...rest}
        className={cx(classes.userList, rest?.className)}
        disablePadding
      >
        {children}
      </AppList>
    );
  }
);

const UserContainer = forwardRef(
  (
    props: React.ComponentPropsWithoutRef<"div">,
    ref: React.ForwardedRef<any>
  ) => {
    const { children, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <div
        ref={ref}
        {...rest}
        className={cx(classes.userContainer, rest.className)}
      >
        {children}
      </div>
    );
  }
);

const renderUserItem = memo(
  (props: { index: number; style: React.CSSProperties }) => {
    const { index, style } = props;

    return <UserItem style={style} index={index} />;
  },
  _isEqual
);

const AiChatUserListTurnOffDialog = () => {
  const {
    aiChatUserListTurnOffDialogOpen,
    closeAiChatUserListTurnOffDialog,
    turnOffInboxThreadAiChatUsers,
  } = useContext(InboxSlugContext);
  const [
    selectedInboxThreadOfferProductAiChatTurnOffTimeOption,
    setSelectedInboxThreadOfferProductAiChatTurnOffTimeOption,
  ] = useState<number>(
    inboxConstants.inboxThreadOfferProductAiChatTurnOffTimeOptions[0]
  );
  const [
    selectedInboxThreadOfferProductAiChatUserIds,
    setSelectedInboxThreadOfferProductAiChatUserIds,
  ] = useState<number[]>([]);

  const [
    inboxThreadOfferProductAiChatUsersPage,
    setInboxThreadOfferProductAiChatUsersPage,
  ] = useState(1);
  const [variableSizeListItemHeight, setVariableSizeListItemHeight] =
    useState(1);

  const fetchedInboxThreadOfferProductAiChatUsersSourceRef =
    useRef<CancelTokenSource | null>(null);
  const variableSizeListRef = useRef<any>(null);
  const indexToUserItemSizeMap = useRef<{ [index: number]: number }>({});

  const { t } = useTranslation();

  const $s_inboxThreadOfferProduct = useAppSelector(
    storeInboxSelectors.selectInboxThreadOfferProduct
  );
  const $s_inboxThreadOfferProductAiChatUsers = useAppSelector(
    (state) => state.user.inboxThreadOfferProductAiChatUsers
  );
  const $s_inboxThreadOfferProductAiChatUsersCount = useAppSelector(
    (state) => state.user.inboxThreadOfferProductAiChatUsersCount
  );
  const $s_inboxThreadOfferProductAiChatUsersLoading = useAppSelector(
    (state) => state.user.inboxThreadOfferProductAiChatUsersLoading
  );
  const $s_inboxThreadOfferProductAiChatUsersError = useAppSelector(
    (state) => state.user.inboxThreadOfferProductAiChatUsersError
  );

  const inboxThreadOfferProductAiChatUsersLoading =
    $s_inboxThreadOfferProductAiChatUsersLoading ||
    !!$s_inboxThreadOfferProductAiChatUsersError;

  const hasNextInboxThreadOfferProductUserPage =
    INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_LIMIT *
      inboxThreadOfferProductAiChatUsersPage <
    $s_inboxThreadOfferProductAiChatUsersCount;

  const variableSizeListItemCount =
    1 +
    $s_inboxThreadOfferProductAiChatUsers.length +
    (inboxThreadOfferProductAiChatUsersLoading ||
    $s_inboxThreadOfferProductAiChatUsers.length < 1
      ? 1
      : 0);

  const { classes } = useStyles();

  const dispatch = useAppDispatch();

  const $s_userAction = useMemo(
    () => bindActionCreators(storeUserAction, dispatch),
    [dispatch]
  );

  const handleInboxThreadOfferProductAiChatTurnOffTimeOptionSelect =
    (
      inboxThreadOfferProductAiChatTurnOffTimeOption: typeof selectedInboxThreadOfferProductAiChatTurnOffTimeOption
    ) =>
    () => {
      setSelectedInboxThreadOfferProductAiChatTurnOffTimeOption(
        inboxThreadOfferProductAiChatTurnOffTimeOption
      );
    };

  const toggleInboxThreadOfferProductAiChatUserId: AiChatUserListTurnOffDialogContextValue["toggleInboxThreadOfferProductAiChatUserId"] =
    (inboxThreadOfferProductAiChatUserId) => {
      const newSelectedInboxThreadOfferProductAiChatUserIds = [
        ...selectedInboxThreadOfferProductAiChatUserIds,
      ];
      const inboxThreadOfferProductAiChatUserIdIndex =
        newSelectedInboxThreadOfferProductAiChatUserIds.findIndex(
          (userId) => userId === inboxThreadOfferProductAiChatUserId
        );
      if (inboxThreadOfferProductAiChatUserIdIndex === -1)
        newSelectedInboxThreadOfferProductAiChatUserIds.push(
          inboxThreadOfferProductAiChatUserId
        );
      else
        newSelectedInboxThreadOfferProductAiChatUserIds.splice(
          inboxThreadOfferProductAiChatUserIdIndex,
          1
        );
      setSelectedInboxThreadOfferProductAiChatUserIds(
        newSelectedInboxThreadOfferProductAiChatUserIds
      );
    };

  const addAllInboxThreadOfferProductAiChatUserIds = () => {
    setSelectedInboxThreadOfferProductAiChatUserIds(
      $s_inboxThreadOfferProductAiChatUsers.map((user) => user.id)
    );
  };

  const removeAllInboxThreadOfferProductAiChatUserIds = () => {
    setSelectedInboxThreadOfferProductAiChatUserIds([]);
  };

  const fetchInboxThreadOfferProductAiChatUsers = (payload?: {
    params?: {
      page?: number;
    };
    cancelToken?: CancelTokenSource["token"];
    meta?: {
      isLoadMore?: boolean;
      isReset?: boolean;
    };
  }) => {
    $s_userAction.fetchInboxThreadOfferProductAiChatUsersSaga(
      {
        params: {
          product_id: $s_inboxThreadOfferProduct?.id!,
          // product_id: 4095,
          type: inboxConstants.INBOX_THREAD_AI_CHAT_ON_TYPE,
          limit: INBOX_THREAD_OFFER_PRODUCT_AI_CHAT_USERS_LIMIT,
          page: inboxThreadOfferProductAiChatUsersPage,
          ...payload?.params,
        },
        cancelToken: payload?.cancelToken,
      },
      {
        isLoadMore: !!payload?.meta?.isLoadMore,
        isReset: !!payload?.meta?.isReset,
      }
    );
  };

  const isInboxThreadOfferProductAiChatUsersLoaded = (index: number) => {
    return !hasNextInboxThreadOfferProductUserPage || index > 0;
  };

  const handleFetchMoreInboxThreadOfferProductAiChatUsers = () => {
    const newInboxThreadOfferProductAiChatUsersPage =
      inboxThreadOfferProductAiChatUsersPage + 1;
    if (!fetchedInboxThreadOfferProductAiChatUsersSourceRef.current) {
      fetchedInboxThreadOfferProductAiChatUsersSourceRef.current =
        axios.CancelToken.source();
    }
    setInboxThreadOfferProductAiChatUsersPage(
      newInboxThreadOfferProductAiChatUsersPage
    );
    fetchInboxThreadOfferProductAiChatUsers({
      params: {
        page: newInboxThreadOfferProductAiChatUsersPage,
      },
      cancelToken:
        fetchedInboxThreadOfferProductAiChatUsersSourceRef.current.token,
      meta: {
        isLoadMore: true,
      },
    });
  };

  const changeUserItemSize = useEventCallback((index: number, size: number) => {
    const curIndexToUserItemSize = indexToUserItemSizeMap.current[index];
    indexToUserItemSizeMap.current = {
      ...indexToUserItemSizeMap.current,
      [index]: size,
    };
    if (
      !variableSizeListRef.current ||
      (typeof curIndexToUserItemSize !== "undefined" &&
        curIndexToUserItemSize === size)
    )
      return;
    setVariableSizeListItemHeight(
      Object.entries(indexToUserItemSizeMap.current).reduce(
        (curSize, [_, userItemSize]) => {
          return curSize + (userItemSize ?? 0);
        },
        0
      )
    );
    variableSizeListRef.current.resetAfterIndex(index);
  });

  const getUserItemSize = (index: number) => {
    return indexToUserItemSizeMap.current[index] ?? 50;
  };

  const handleTurnedOffAiChatSubmit = () => {
    turnOffInboxThreadAiChatUsers({
      seconds: selectedInboxThreadOfferProductAiChatTurnOffTimeOption,
      userIds: selectedInboxThreadOfferProductAiChatUserIds,
    });
  };

  useEffect(() => {
    if (!!aiChatUserListTurnOffDialogOpen) {
      fetchedInboxThreadOfferProductAiChatUsersSourceRef.current =
        axios.CancelToken.source();
      setSelectedInboxThreadOfferProductAiChatUserIds([]);
      setInboxThreadOfferProductAiChatUsersPage(1);
      fetchInboxThreadOfferProductAiChatUsers({
        params: {
          page: 1,
        },
        meta: {
          isReset: true,
        },
      });
      return () => {
        fetchedInboxThreadOfferProductAiChatUsersSourceRef.current!.cancel();
        fetchedInboxThreadOfferProductAiChatUsersSourceRef.current = null;
      };
    }
  }, [aiChatUserListTurnOffDialogOpen]);

  return (
    <AiChatUserListTurnOffDialogContext.Provider
      value={{
        inboxThreadOfferProductAiChatUsersLoading,
        selectedInboxThreadOfferProductAiChatUserIds,
        changeUserItemSize,
        addAllInboxThreadOfferProductAiChatUserIds,
        removeAllInboxThreadOfferProductAiChatUserIds,
        toggleInboxThreadOfferProductAiChatUserId,
      }}
    >
      <AppDialog
        maxWidth="xs"
        fullWidth
        mobileFullScreen
        scroll="paper"
        mobileScroll="paper"
        open={aiChatUserListTurnOffDialogOpen}
        onClose={closeAiChatUserListTurnOffDialog}
      >
        <AppDialogTitle onCloseButtonClick={closeAiChatUserListTurnOffDialog}>
          {t("turnOffAIFor")}
        </AppDialogTitle>
        <AppDialogContent className={classes.dialogContent}>
          <div className={classes.timeSection}>
            <Grid container spacing={2} flexWrap="nowrap">
              {inboxConstants.inboxThreadOfferProductAiChatTurnOffTimeOptions.map(
                (seconds) => (
                  <Grid key={seconds} item xs="auto">
                    <Box width="100%" overflow="clip" display="flex">
                      <AppButton
                        size="small"
                        variant={
                          selectedInboxThreadOfferProductAiChatTurnOffTimeOption ===
                          seconds
                            ? "contained"
                            : "outlined"
                        }
                        noWrap
                        color="text.primary"
                        onClick={handleInboxThreadOfferProductAiChatTurnOffTimeOptionSelect(
                          seconds
                        )}
                      >
                        {t("minWithCount", {
                          count: seconds / 60,
                        })}
                      </AppButton>
                    </Box>
                  </Grid>
                )
              )}
            </Grid>
          </div>
          <Divider />

          <InfiniteLoader
            isItemLoaded={isInboxThreadOfferProductAiChatUsersLoaded}
            threshold={2}
            itemCount={variableSizeListItemCount}
            loadMoreItems={handleFetchMoreInboxThreadOfferProductAiChatUsers}
          >
            {({ onItemsRendered, ref }) => (
              <VariableSizeList
                useIsScrolling
                itemData={$s_inboxThreadOfferProductAiChatUsers}
                itemCount={variableSizeListItemCount}
                height={variableSizeListItemHeight}
                width="100%"
                ref={(_variableSizeListRef) => {
                  variableSizeListRef.current = _variableSizeListRef;
                  ref(_variableSizeListRef);
                }}
                layout={"vertical"}
                overscanCount={2}
                itemKey={(index, data) => {
                  const inboxThreadOfferProductAiChatUserIndex = index - 1;
                  return (
                    data[inboxThreadOfferProductAiChatUserIndex]?.id ||
                    `index-${index}`
                  );
                }}
                onItemsRendered={onItemsRendered}
                outerElementType={UserContainer}
                innerElementType={UserList}
                itemSize={getUserItemSize}
              >
                {renderUserItem}
              </VariableSizeList>
            )}
          </InfiniteLoader>
        </AppDialogContent>
        <AppDialogActions>
          <AppButton
            variant="outlined"
            color="text.primary"
            fullWidth
            onClick={closeAiChatUserListTurnOffDialog}
          >
            {t("cancel")}
          </AppButton>
          <AppButton
            disabled={selectedInboxThreadOfferProductAiChatUserIds.length < 1}
            variant="contained"
            color="text.primary"
            fullWidth
            onClick={handleTurnedOffAiChatSubmit}
          >
            {t("ok")}
          </AppButton>
        </AppDialogActions>
      </AppDialog>
    </AiChatUserListTurnOffDialogContext.Provider>
  );
};

export default AiChatUserListTurnOffDialog;
