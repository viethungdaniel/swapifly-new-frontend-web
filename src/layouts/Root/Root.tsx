import _isFunction from "lodash/isFunction";
import _kebabCase from "lodash/kebabCase";
import { NextSeo } from "next-seo";
import { bindActionCreators } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify";
import { MessagePayload, onMessage } from "firebase/messaging";

import { commonApi } from "@/utils/apis";
import {
  commonHelpers,
  inboxHelpers,
  notificationHelpers,
} from "@/utils/helpers";
import { commonConfig } from "@/utils/config";
import {
  storeCommonAction,
  storeInboxAction,
  storeNotificationAction,
  storeProductCategoryAction,
} from "@/store";
import {
  appBroadcastChannelConstants,
  commonConstants,
} from "@/utils/constants";

import { Box, NoSsr } from "@mui/material";
import AppImage from "@/components/AppImage";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";

import PhotoIcon from "@@/public/images/icons/photo.svg";
import NotificationsIcon from "@@/public/images/icons/notifications.svg";
import InboxIcon from "@@/public/images/icons/inbox.svg";

import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  useAppDispatch,
  useAppSelector,
  useAppWebsocket,
  useAuthUser,
  useEventCallback,
  useFirebase,
  useIsMounted,
} from "@/hooks";

import useStyles from "./Root.styles";

import type { NextSeoProps } from "next-seo";
import type { CancelTokenSource } from "axios";

export type RootProps = {
  headParams?: NextSeoProps;
  children: React.ReactNode;
};

type FirebaseNotificationData<T = Record<string, any>> = {
  data: {
    id: number;
    notice_type: string;
    msg?: string;
    chat_value?: string;
    related_type?: string;
    related_value?: string;
    related_value_item?: string;
    status?: string;
    type?: string;
    url?: string;
    url_type?: string;
  };
  notification: {
    title: string;
    body: string;
    icon: string;
    image: string;
  };
  [x: string]: any;
} & T;

type FirebaseNotificationClickData = {
  payload: FirebaseNotificationData;
  routerLocation: {
    baseUrl: string;
    pathname: string;
    search: string;
    query: Record<string, any>;
    url: string;
  };
};

const FetchInitialData = () => {
  const { i18n } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_productCategoryAction = useMemo(
    () => bindActionCreators(storeProductCategoryAction, dispatch),
    [dispatch]
  );
  // const $s_productAction = useMemo(
  //   () => bindActionCreators(storeProductAction, dispatch),
  //   [dispatch]
  // );
  const $s_commonAction = useMemo(
    () => bindActionCreators(storeCommonAction, dispatch),
    [dispatch]
  );
  const $s_notificationAction = useMemo(
    () => bindActionCreators(storeNotificationAction, dispatch),
    [dispatch]
  );
  const $s_inboxAction = useMemo(
    () => bindActionCreators(storeInboxAction, dispatch),
    [dispatch]
  );

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const fetchedProductCategorySourceRef = useRef<CancelTokenSource>();
  const fetchedTermsOfServiceAndPrivacyPolicySourceRef =
    useRef<CancelTokenSource>();
  const fetchedRegionsSourceRef = useRef<CancelTokenSource>();
  const fetchedCookieTokenSourceRef = useRef<CancelTokenSource>();
  const fetchedUnreadNotificationCountSourceRef = useRef<CancelTokenSource>();
  const fetchedUnreadInboxThreadMessageCountSourceRef =
    useRef<CancelTokenSource>();

  const fetchUnreadInboxThreadMessageCount = () => {
    fetchedUnreadInboxThreadMessageCountSourceRef.current?.cancel &&
      fetchedUnreadInboxThreadMessageCountSourceRef.current.cancel();
    fetchedUnreadInboxThreadMessageCountSourceRef.current =
      axios.CancelToken.source();
    $s_inboxAction.fetchUnreadInboxThreadMessageCountSaga({
      cancelToken: fetchedUnreadInboxThreadMessageCountSourceRef.current.token,
    });
  };

  const fetchData = () => {
    fetchedProductCategorySourceRef.current = axios.CancelToken.source();
    fetchedRegionsSourceRef.current = axios.CancelToken.source();
    fetchedCookieTokenSourceRef.current = axios.CancelToken.source();
    fetchedTermsOfServiceAndPrivacyPolicySourceRef.current =
      axios.CancelToken.source();

    $s_productCategoryAction.fetchProductCategoriesSaga({
      cancelToken: fetchedProductCategorySourceRef.current.token,
    });
    $s_commonAction.fetchRegionsSaga({
      cancelToken: fetchedRegionsSourceRef.current.token,
    });
    $s_commonAction.fetchCookieTokenSaga({
      cancelToken: fetchedCookieTokenSourceRef.current.token,
    });
    $s_commonAction.fetchTermsOfServiceAndPrivacyPolicySaga({
      cancelToken: fetchedTermsOfServiceAndPrivacyPolicySourceRef.current.token,
    });
  };

  const fetchAuthData = () => {
    fetchedUnreadNotificationCountSourceRef.current =
      axios.CancelToken.source();

    fetchUnreadInboxThreadMessageCount();
    $s_notificationAction.fetchUnreadNotificationSaga({
      cancelToken: fetchedUnreadNotificationCountSourceRef.current.token,
    });
  };

  useAppWebsocket({
    onInboxThreadDelete: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadFetch: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadMessageReadMark: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onProductInboxThreadOfferCreate: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadOfferCreate: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadOfferUpdate: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadOfferCancel: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadOfferAccept: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadOfferDecline: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadMessageSubmit: () => {
      fetchUnreadInboxThreadMessageCount();
    },
    onInboxThreadAIMessageEmit: () => {
      fetchUnreadInboxThreadMessageCount();
    },
  });

  useEffect(() => {
    fetchData();
    return () => {
      fetchedProductCategorySourceRef.current?.cancel &&
        fetchedProductCategorySourceRef.current.cancel();
      fetchedRegionsSourceRef.current?.cancel &&
        fetchedRegionsSourceRef.current.cancel();
      fetchedCookieTokenSourceRef.current?.cancel &&
        fetchedCookieTokenSourceRef.current.cancel();
      fetchedTermsOfServiceAndPrivacyPolicySourceRef.current?.cancel &&
        fetchedTermsOfServiceAndPrivacyPolicySourceRef.current.cancel();
    };
  }, [i18n.language]);

  useEffect(() => {
    if (!!$s_hasAuth) fetchAuthData();
    else {
      $s_notificationAction.setUnreadNotificationCountRead(0);
      $s_inboxAction.setUnreadInboxThreadMessageCount(0);
    }
    return () => {
      fetchedUnreadInboxThreadMessageCountSourceRef.current?.cancel &&
        fetchedUnreadInboxThreadMessageCountSourceRef.current.cancel();
      fetchedUnreadNotificationCountSourceRef.current?.cancel &&
        fetchedUnreadNotificationCountSourceRef.current.cancel();
    };
  }, [$s_hasAuth]);

  return null;
};

const FirebaseNotification = () => {
  const { messaging, getToken } = useFirebase();

  const { i18n } = useTranslation();
  const { hasAuth } = useAuthUser();
  const router = useRouter();
  const dispatch = useAppDispatch();

  const $s_notificationAction = useMemo(
    () => bindActionCreators(storeNotificationAction, dispatch),
    [dispatch]
  );

  const { classes } = useStyles();

  const { t } = useTranslation();

  const handleFirebaseMessage = useEventCallback((payload: MessagePayload) => {
    pushNotificationToast(payload as any);
  });

  const getMessage = () => {
    if (!messaging) return;
    onMessage(messaging, handleFirebaseMessage);
  };

  const readNotification = useEventCallback((notificationId: number) => {
    $s_notificationAction.readNotificationSaga({
      params: {
        id: notificationId,
      },
    });
  });

  const registerAppDevice = async () => {
    try {
      if (!messaging) return;
      const fcmId = await getToken();
      if (!fcmId) return;
      await commonApi.registerFirebaseNotificationDevice({
        params: {
          platform: `${commonHelpers.isMobile() ? "mobile_web_" : ""}${
            (navigator as any)?.userAgentData?.platform ||
            _kebabCase(
              commonHelpers.getMobileOperatingSystem() ?? "unknown"
            ).toLowerCase()
          }`,
          fcm_id: fcmId,
          language: i18n.language.toLowerCase(),
          os_version: navigator.appVersion,
          phone_model: commonHelpers.getPhoneModel(),
          phone_udid: "",
          app_version: commonConfig.APP_VERSION,
        },
      });
      getMessage();
    } catch {}
  };

  const requestNotificationPermission = () => {
    try {
      if (commonHelpers.isIOS()) {
        registerAppDevice();
      } else
        Notification.requestPermission(function (permission) {
          if (permission === "granted") {
            registerAppDevice();
          }
        });
    } catch {}
  };

  const pushNotificationToast = useEventCallback(
    (payload: FirebaseNotificationData) => {
      const notificationTitle = payload?.notification?.title;
      let notificationBody: any = payload?.notification?.body;
      const notificationImage = payload?.notification?.image;
      let notificationRelatedValueItem: any = {};
      let notificationChatValueItem: any = {};
      const isInboxNoticeType =
        payload.data.notice_type ===
        commonConstants.FIREBASE_NOTIFICATION_INBOX_NOTICE_TYPE;
      try {
        notificationRelatedValueItem = JSON.parse(
          payload.data.related_value_item!
        );
      } catch {}
      try {
        notificationChatValueItem = JSON.parse(payload.data.chat_value!);
      } catch {}

      let routerLocation: {
        href?: string;
        newBrowserWindow?: boolean;
      };
      if (isInboxNoticeType) {
        routerLocation = {
          href: `/inbox/${notificationChatValueItem.thread_id}`,
        };
        notificationBody = inboxHelpers.isInboxThreadMessageContentImageType(
          notificationChatValueItem.c_type
        ) ? (
          <Box display="flex" alignItems="center" gap={0.5}>
            <AppSvgIcon
              component={PhotoIcon}
              color="inherit"
              fontSize="small"
              sx={{ ml: "-2px", my: "-2px" }}
            />
            <span>{t("image")}</span>
          </Box>
        ) : (
          notificationBody
        );
      } else {
        routerLocation = {
          ...(notificationHelpers.isNotificationUrl(payload.data.type!)
            ? {
                href: payload.data.url,
                newBrowserWindow: true,
              }
            : notificationHelpers.isNotificationRelatedContent(
                payload.data.type!
              )
            ? {
                href: notificationHelpers.getNotificationRelatedContentPath({
                  related_type: payload.data.related_type,
                  related_value_item: notificationRelatedValueItem as any,
                }),
                newBrowserWindow: false,
              }
            : {
                href: `/notifications/${commonHelpers.generateSlug(
                  payload.data.msg,
                  payload.data.id
                )}`,
                newBrowserWindow: false,
              }),
        };
        $s_notificationAction.increaseUnreadNotificationCountRead();
      }

      toast.info(
        <>
          <AppTypography
            className={classes.notificationTitle}
            variant="bodyMed14"
          >
            {notificationTitle}
          </AppTypography>
          <AppTypography className={classes.notificationContent}>
            {notificationBody}
          </AppTypography>
        </>,
        {
          onClick: handleMessageToastClick({
            href: routerLocation.href!,
            newBrowserWindow: !!routerLocation.newBrowserWindow,
            notificationId: payload.data.id,
          }),
          autoClose: 5000,
          position: "bottom-left",
          icon: (
            <>
              {!notificationImage ? (
                <div className={classes.notificationIconWrapper}>
                  <AppSvgIcon
                    component={
                      isInboxNoticeType ? InboxIcon : NotificationsIcon
                    }
                    className={classes.notificationIcon}
                  />
                </div>
              ) : (
                <AppImage
                  className={classes.notificationImage}
                  src={notificationImage}
                  unoptimized
                  objectFit="contain"
                  objectPosition="center"
                  width={500}
                  height={500}
                  alt={`${notificationTitle}`}
                />
              )}
            </>
          ),
        }
      );
    }
  );

  const handleMessageToastClick = useEventCallback(
    (payload: {
        href: string;
        newBrowserWindow: boolean;
        notificationId: number;
      }) =>
      () => {
        readNotification(payload.notificationId);
        if (!payload.href) return;
        if (payload?.newBrowserWindow) window.open(payload.href, "_blank");
        else router.push(payload.href, undefined);
      }
  );

  const handleFirebaseBackgroundMessage = useEventCallback(
    (event: MessageEvent<FirebaseNotificationData>) => {
      const payload = event.data;
      pushNotificationToast(payload);
    }
  );

  const handleFirebaseNotificationClick = useEventCallback(
    (event: MessageEvent<FirebaseNotificationClickData>) => {
      const { payload, routerLocation } = event.data;

      if (
        payload.data.notice_type ===
        commonConstants.FIREBASE_NOTIFICATION_NORMAL_NOTICE_TYPE
      ) {
        readNotification(payload.data.id);
      }
      if (window.location.pathname === routerLocation.pathname) {
        router.push(
          {
            pathname: routerLocation.pathname,
            query: routerLocation.query,
          },
          undefined
        );
      }
    }
  );

  useEffect(() => {
    !!messaging && requestNotificationPermission();
  }, [hasAuth, messaging]);

  useEffect(() => {
    const channel = new BroadcastChannel(
      appBroadcastChannelConstants.FIREBASE_NOTIFICATION_BACKGROUND_MESSAGE_CHANNEL_NAME
    );
    channel.addEventListener("message", handleFirebaseBackgroundMessage);
    return () => {
      channel.removeEventListener("message", handleFirebaseBackgroundMessage);
    };
  }, [handleFirebaseBackgroundMessage]);

  useEffect(() => {
    const channel = new BroadcastChannel(
      appBroadcastChannelConstants.FIREBASE_NOTIFICATION_CLICK_CHANNEL_NAME
    );
    channel.addEventListener("message", handleFirebaseNotificationClick);
    return () => {
      channel.removeEventListener("message", handleFirebaseNotificationClick);
    };
  }, [handleFirebaseNotificationClick]);

  return null;
};

const WebsocketConnection = () => {
  const $s_authUserId = useAppSelector((state) => state.auth.user?.id);
  const $s_userAuthChecking = useAppSelector(
    (state) => state.auth.userAuthChecking
  );
  const { i18n } = useTranslation();

  const isAliveWebsocketRef = useRef(true);
  const retryTimeoutRef = useRef(5000);
  const keepUserWebsocketConnectionTimeoutRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const reConnectedWebsocketTimeoutRef = useRef<ReturnType<
    typeof setInterval
  > | null>(null);
  const isDisabledWebsocketReConnectedRef = useRef(true);

  const appWebsocket = useAppWebsocket({
    onClose: () => {
      clearInterval(keepUserWebsocketConnectionTimeoutRef.current!);
      if (isDisabledWebsocketReConnectedRef.current) return;
      retryTimeoutRef.current = retryTimeoutRef.current + 250;
      reConnectedWebsocketTimeoutRef.current = setTimeout(
        checkWebsocketConnection,
        Math.min(60000, retryTimeoutRef.current)
      );
    },
    onError: () => {
      closeWebsocketConnection();
    },
    onRegister: () => {
      isAliveWebsocketRef.current = true;
    },
  });

  const closeWebsocketConnection = () => {
    appWebsocket.closeWebsocket();
  };

  const checkWebsocketConnection = useEventCallback(() => {
    if (appWebsocket.connectionState.isClosed) {
      appWebsocket.connectWebsocket();
    }
  });

  const keepUserWebsocketConnection = useEventCallback(() => {
    if (!isAliveWebsocketRef.current) {
      closeWebsocketConnection();
      return;
    }
    isAliveWebsocketRef.current = false;
    appWebsocket.register();
  });

  const registerUserWebsocket = useEventCallback(() => {
    isDisabledWebsocketReConnectedRef.current = false;
    appWebsocket.register();
    keepUserWebsocketConnectionTimeoutRef.current = setInterval(
      keepUserWebsocketConnection,
      25000
    );
  });

  useEffect(() => {
    if (!$s_userAuthChecking && !!$s_authUserId) {
      if (!appWebsocket.connectionState.isOpen) {
        appWebsocket.connectWebsocket();
        return;
      }
      registerUserWebsocket();
      return () => {
        clearInterval(keepUserWebsocketConnectionTimeoutRef.current!);
      };
    } else if (!$s_userAuthChecking && !$s_authUserId) {
      isDisabledWebsocketReConnectedRef.current = true;
      closeWebsocketConnection();
    }
  }, [
    $s_userAuthChecking,
    $s_authUserId,
    i18n.language,
    appWebsocket.connectionState.isOpen,
  ]);

  useEffect(() => {
    return () => {
      clearTimeout(reConnectedWebsocketTimeoutRef.current!);
      closeWebsocketConnection();
    };
  }, []);

  return null;
};

const Root = (props: RootProps) => {
  const { headParams, children } = props;

  const [pageRefreshing, setPageRefreshing] = useState(false);

  const { i18n } = useTranslation();
  const regionId = useAppSelector((state) => state.common.region?.id);

  useEffect(() => {
    if (!isMounted()) return;
    setPageRefreshing(true);
  }, [i18n.language, regionId]);

  useEffect(() => {
    if (!isMounted()) return;
    pageRefreshing && setPageRefreshing(false);
  }, [pageRefreshing]);

  const isMounted = useIsMounted();

  return (
    <>
      <NextSeo {...headParams} />
      <NoSsr>
        <WebsocketConnection />
        <FirebaseNotification />
        <FetchInitialData />
      </NoSsr>
      {!pageRefreshing && <>{children}</>}
    </>
  );
};

export default Root;
