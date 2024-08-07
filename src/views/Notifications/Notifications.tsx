import axios from "axios";
import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import {
  axiosHelpers,
  commonHelpers,
  notificationHelpers,
  reduxHelpers,
} from "@/utils/helpers";
import { storeNotificationAction } from "@/store";
import { commonConstants } from "@/utils/constants";
import { alertDialogService, loadingScreenOverlayService } from "@/services";

import { Box, Divider, Grid, Skeleton } from "@mui/material";
import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppLoading from "@/components/AppLoading";
import LoadingSkeleton from "@/components/LoadingSkeleton";
import NoSearchResults from "@/components/NoSearchResults";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent/AppContent";
import WindowInfiniteScrollLoader from "@/components/WindowInfiniteScrollLoader";

import {
  useAppDispatch,
  useAppMomentWithLocale,
  useAppSelector,
  useEventCallback,
  useIsMounted,
} from "@/hooks";
import { useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "next-i18next";

import useStyles from "./Notifications.styles";

import type { CancelToken, CancelTokenSource } from "axios";

const NOTIFICATIONS_LIMIT = 8;

const NotificationList = () => {
  const dispatch = useAppDispatch();

  const $s_notificationAction = useMemo(
    () => bindActionCreators(storeNotificationAction, dispatch),
    [dispatch]
  );

  const $s_notifications = useAppSelector(
    (state) => state.notification.notifications
  );

  const { momentWithLocaleByCurrentTz } = useAppMomentWithLocale();

  const { classes, cx } = useStyles();

  const handleNotificationRead = (notificationId: number) => () => {
    $s_notificationAction.readNotificationSaga({
      params: {
        id: notificationId,
      },
    });
  };

  return $s_notifications.map((notification, notificationIndex) => {
    return (
      <Grid key={`${notification.id}${notificationIndex}`} item xs={12}>
        <AppLink
          {...(notificationHelpers.isNotificationUrl(notification.type)
            ? {
                href: notification.url,
                disabledNextLink: true,
                target: "_blank",
              }
            : notificationHelpers.isNotificationRelatedContent(
                notification.type
              )
            ? {
                href: notificationHelpers.getNotificationRelatedContentPath(
                  notification
                ),
              }
            : {
                href: `/notifications/${commonHelpers.generateSlug(
                  notification.msg,
                  notification.id
                )}`,
              })}
          underline="none"
          hoverColor="none"
          className={cx(classes.notificationItem, {
            [classes.notificationItemDivider]: notificationIndex !== 0,
            [classes.notificationItemRead]: !!notification.is_read,
          })}
          onClick={handleNotificationRead(notification.id)}
        >
          <div className={classes.notificationItemDateTime}>
            <AppTypography
              variant="bodyMed14"
              color="text.secondary"
              flex={1}
              noWrap
            >
              {notification.id} -
              {momentWithLocaleByCurrentTz(
                notification.create_time,
                "X"
              ).format("DD/MM/YYYY HH:mm")}
            </AppTypography>
            {!notification.is_read && (
              <span className={classes.notificationItemDot} />
            )}
          </div>
          <AppTypography variant="bodyMed16" noWrap>
            {notification.msg}
          </AppTypography>
          <AppTypography className={classes.notificationItemContent}>
            {notification.short_desc}
          </AppTypography>
        </AppLink>
      </Grid>
    );
  });
};

const Notifications = () => {
  const fetchNotificationsSourceRef = useRef<CancelTokenSource | null>(null);
  const fetchUnreadNotificationCountSourceRef =
    useRef<CancelTokenSource | null>(null);
  const readAllNotificationSourceRef = useRef<CancelTokenSource | null>(null);

  const { classes } = useStyles();

  const { t } = useTranslation();

  const [notificationPage, setNotificationPage] = useState(1);

  const dispatch = useAppDispatch();

  const $s_notificationAction = useMemo(
    () => bindActionCreators(storeNotificationAction, dispatch),
    [dispatch]
  );

  const $s_notificationsLength = useAppSelector(
    (state) => state.notification.notifications.length
  );
  const $s_notificationsCount = useAppSelector(
    (state) => state.notification.notificationsCount
  );
  const $s_notificationsLoading = useAppSelector(
    (state) => state.notification.notificationsLoading
  );
  const $s_notificationsError = useAppSelector(
    (state) => state.notification.notificationsError
  );

  const canLoadMore =
    NOTIFICATIONS_LIMIT * notificationPage < $s_notificationsCount;
  const skeletonLoading = $s_notificationsLoading && notificationPage === 1;
  const isEmptyNotification =
    !$s_notificationsLoading && $s_notificationsLength === 0;

  const scrollLoaderHasNextPage = useMemo(() => {
    return (
      !$s_notificationsLoading &&
      canLoadMore &&
      !$s_notificationsError &&
      notificationPage < commonConstants.FETCHED_MAXIMUM_PAGE
    );
  }, [
    $s_notificationsLoading,
    canLoadMore,
    notificationPage,
    $s_notificationsError,
  ]);

  const fetchNotifications = useEventCallback(
    (payload?: {
      params?: {
        page?: number;
      };
      cancelToken?: CancelToken;
      meta?: {
        isLoadMore?: boolean;
        isReset?: boolean;
      };
    }) => {
      if (!fetchNotificationsSourceRef.current) {
        fetchNotificationsSourceRef.current = axios.CancelToken.source();
      }

      type FetchNotificationParams = NonNullable<
        Parameters<typeof $s_notificationAction.fetchNotificationsSaga>[0]
      >["params"];

      let outerParams =
        commonHelpers.prepareRequestParams<FetchNotificationParams>({
          page: payload?.params?.page,
        });

      const curParams =
        commonHelpers.prepareRequestParams<FetchNotificationParams>(
          {
            page: notificationPage,
            ...outerParams,
          },
          { enableClearEmptyValue: true }
        );

      $s_notificationAction.fetchNotificationsSaga(
        {
          params: curParams,
          cancelToken: fetchNotificationsSourceRef.current.token,
        },
        {
          isReset: payload?.meta?.isReset,
          isLoadMore: payload?.meta?.isLoadMore,
        }
      );
    }
  );

  const handleLoadMore = () => {
    const newNotificationPage = notificationPage + 1;
    setNotificationPage(newNotificationPage);
    fetchNotifications({
      params: {
        page: newNotificationPage,
      },
      meta: {
        isLoadMore: true,
      },
    });
  };

  const handleAllNotificationRead = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("readAllConfirmationTitle"),
      content: t("readAllConfirmationTitle"),
    });

    if (!isConfirmed) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);
    readAllNotificationSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_notificationAction.readAllNotificationSaga,
      {
        cancelToken: readAllNotificationSourceRef.current.token,
      }
    );
    if (!isMounted()) {
      loadingScreenOverlayService.close();
      return;
    }
    if (!axiosHelpers.checkRequestSuccess(response)) {
      toast.error(response.message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    fetchNotifications({
      params: {
        page: 1,
      },
      meta: {
        isReset: true,
      },
    });

    fetchUnreadNotificationCountSourceRef.current = axios.CancelToken.source();
    $s_notificationAction.fetchUnreadNotificationSaga({
      cancelToken: fetchUnreadNotificationCountSourceRef.current.token,
    });
    return () => {
      readAllNotificationSourceRef.current?.cancel &&
        readAllNotificationSourceRef.current.cancel();

      fetchNotificationsSourceRef.current?.cancel &&
        fetchNotificationsSourceRef.current.cancel();
      fetchNotificationsSourceRef.current = null;

      fetchUnreadNotificationCountSourceRef.current?.cancel &&
        fetchUnreadNotificationCountSourceRef.current.cancel();
      fetchUnreadNotificationCountSourceRef.current = null;
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <>
      <AppContent className={classes.main}>
        <AppContainer>
          <AppTypography
            variant="titleSemi20"
            display="flex"
            alignItems="center"
            component="div"
            mb={1.25}
          >
            <AppTypography variant="inherit" flex={1} noWrap>
              {t("notice")}
            </AppTypography>
            <AppButton
              edge="xy"
              size="small"
              variant="text"
              noWrap
              onClick={handleAllNotificationRead}
            >
              {t("readAll")}
            </AppButton>
          </AppTypography>
          <Divider />
        </AppContainer>

        <AppContainer maxWidth="md">
          <LoadingSkeleton
            loading={skeletonLoading}
            variant="custom"
            customSkeleton={
              <Box my={2.5}>
                <Skeleton
                  variant="text"
                  sx={{ mb: 0.5, width: "25%", maxWidth: "100%" }}
                />
                <Skeleton
                  variant="text"
                  sx={{ mb: 0.5, width: "50%", maxWidth: "100%" }}
                />
                <Skeleton variant="text" />
              </Box>
            }
            count={4}
            keepMounted
            GridContainerProps={{ spacing: 2.5 }}
            GridItemProps={{ xs: 12 }}
          >
            <div className={classes.content}>
              {!isEmptyNotification && (
                <WindowInfiniteScrollLoader
                  hasNextPage={scrollLoaderHasNextPage}
                  threshold={60}
                  onNextPageLoad={handleLoadMore}
                >
                  <Grid container>
                    <NotificationList />
                  </Grid>
                </WindowInfiniteScrollLoader>
              )}
              {isEmptyNotification && (
                <>
                  <NoSearchResults variant="notification" />
                  <AppContainer disableGutters maxWidth="xs">
                    <AppButton
                      fullWidth
                      variant="contained"
                      color="primary"
                      component={AppLink}
                      href="/"
                      underline="none"
                      hoverColor="none"
                    >
                      {t("goToHome")}
                    </AppButton>
                  </AppContainer>
                </>
              )}
              {($s_notificationsLoading ||
                !!$s_notificationsError ||
                (!$s_notificationsLoading &&
                  canLoadMore &&
                  !$s_notificationsError)) && (
                <div className={classes.actions}>
                  {($s_notificationsLoading || !!$s_notificationsError) && (
                    <AppLoading variant="circular" size={40} />
                  )}
                  {!$s_notificationsLoading &&
                    canLoadMore &&
                    !$s_notificationsError && (
                      <AppButton
                        variant="outlined"
                        color="text.primary"
                        onClick={handleLoadMore}
                      >
                        {t("loadMore")}
                      </AppButton>
                    )}
                </div>
              )}
            </div>
          </LoadingSkeleton>
        </AppContainer>
      </AppContent>
    </>
  );
};

export default Notifications;
