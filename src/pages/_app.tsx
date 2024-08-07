import { bindActionCreators } from "@reduxjs/toolkit";
import { toast } from "react-toastify";
import { appWithTranslation } from "next-i18next";
import * as locales from "@mui/material/locale";
import { Poppins as AppFont } from "next/font/google";
import { DefaultSeo } from "next-seo";
import axios from "axios";
import mediaQuery from "css-mediaquery";
import _isEqual from "lodash/isEqual";

// import { END } from "redux-saga";

import { storeAuthAction, storeCommonAction, reduxWrapper } from "@/store";
import nextI18NextConfig from "@@/next-i18next.config";
import { createEmotionCacheApp, createEmotionCacheMui } from "@/libs";
import defaultTheme from "@/assets/theme";
import { commonConfig } from "@/utils/config";
import {
  appGtagService,
  appStorageService,
  eventBusService,
  storageService,
} from "@/services";
import {
  appBroadcastChannelConstants,
  eventBusConstants,
  storageKeyConstants,
} from "@/utils/constants";
import { commonHelpers } from "@/utils/helpers";

import { Provider } from "react-redux";
import { TssCacheProvider } from "tss-react";
import { CacheProvider, EmotionCache } from "@emotion/react";
import { CssBaseline, NoSsr } from "@mui/material";
import { createTheme, ThemeProvider, useTheme } from "@mui/material/styles";

import Head from "next/head";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
} from "chart.js";
import { GoogleOAuthProvider } from "@react-oauth/google";
import LoadingScreenOverlay from "@/components/LoadingScreenOverlay";
import AlertDialog from "@/components/AlertDialog";
import RouterLoadingLinearProgress from "@/components/RouterLoadingLinearProgress";
import ErrorBoundary from "@/components/ErrorBoundary";
import SignInAndSignUpDialog from "@/containers/SignInAndSignUpDialog";
import { FirebaseProvider } from "@/contexts/Firebase";
import AppToastContainer from "@/components/AppToastContainer";
import ImpressionPackageOrderPaymentStatusDialog from "@/components/ImpressionPackageOrderPaymentStatusDialog";

import { useAppDispatch, useAppSelector, useEventCallback } from "@/hooks";
import { useTranslation } from "next-i18next";

import { useRouter } from "next/router";
import { ReactElement, useEffect, useMemo, useRef } from "react";

import "@/assets/scss/app.scss";
import "moment/locale/zh-hk";
import "moment/locale/zh-cn";
import "moment/locale/ja";
import "moment/locale/ko";

import type { NextPage } from "next";
import type { UseTranslationResponse } from "react-i18next";
import type { AppProps } from "next/app";
import type { CancelTokenSource } from "axios";
import type { OnImpressionPackageOrderPaymentStatusDialogOpenData } from "@/components/ImpressionPackageOrderPaymentStatusDialog";

// import type { DefaultSeoProps } from "next-seo";

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (
    page: ReactElement,
    pageProps: P,
    appProps: {
      translation: UseTranslationResponse<"common", undefined>;
    }
  ) => React.ReactNode;
};

type MyAppProps = AppProps<{
  deviceType: string;
  [key: string]: any;
}> & {
  Component: NextPageWithLayout;
  emotionCacheMui?: EmotionCache;
  emotionCacheApp?: EmotionCache;
};

type SupportedLocales = keyof typeof locales;

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const fontApp = AppFont({
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-app",
  preload: false,
});

const clientSideEmotionCacheMui = createEmotionCacheMui();
const clientSideEmotionCacheApp = createEmotionCacheApp();

const theme = createTheme(defaultTheme);

const tabletSsrMatchMedia = (query: string) => ({
  matches: mediaQuery.match(query, {
    width: "0px",
  }),
});

const desktopSsrMatchMedia = (query: string) => ({
  matches: mediaQuery.match(query, {
    // width: theme.breakpoints.values.tablet,
    width: "1024px",
  }),
});

const CheckAuthUser = () => {
  const { t } = useTranslation();

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const handleAuthExpiredToken = useEventCallback((_: MessageEvent) => {
    $s_authAction.signOutOnExpiredTokenSaga();
    if (!$s_hasAuth) return;
    toast.error(t("sessionExpired"));
  });

  const handleAuthSignedInUser = useEventCallback((event: MessageEvent) => {
    const userResponse = event.data;
    $s_authAction.signInSucceeded(userResponse);
  });

  const handleAuthSignedOutUser = useEventCallback((_: MessageEvent) => {
    $s_authAction.signOutSucceeded();
  });

  useEffect(() => {
    const authExpiredTokenBc = new BroadcastChannel(
      appBroadcastChannelConstants.AUTH_EXPIRED_TOKEN_CHANNEL_NAME
    );
    const authSignedInUserBc = new BroadcastChannel(
      appBroadcastChannelConstants.AUTH_SIGNED_IN_USER_CHANNEL_NAME
    );
    const authSignedOutUserBc = new BroadcastChannel(
      appBroadcastChannelConstants.AUTH_SIGNED_OUT_USER_CHANNEL_NAME
    );

    authSignedInUserBc.addEventListener("message", handleAuthSignedInUser);
    authExpiredTokenBc.addEventListener("message", handleAuthExpiredToken);
    authSignedOutUserBc.addEventListener("message", handleAuthSignedOutUser);

    $s_authAction.checkAuthSaga();

    return () => {
      authSignedInUserBc.removeEventListener("message", handleAuthSignedInUser);
      authExpiredTokenBc.removeEventListener("message", handleAuthExpiredToken);
      authSignedOutUserBc.removeEventListener(
        "message",
        handleAuthSignedOutUser
      );
    };
  }, []);

  return null;
};

const MyAppInitialize = () => {
  const router = useRouter();
  const theme = useTheme();
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_commonAction = useMemo(
    () => bindActionCreators(storeCommonAction, dispatch),
    [dispatch]
  );

  const fetchSettingsSourceRef = useRef<CancelTokenSource>();

  const fetchSettings = () => {
    fetchSettingsSourceRef.current = axios.CancelToken.source();
    $s_commonAction.fetchSettingsSaga({
      cancelToken: fetchSettingsSourceRef.current.token,
    });
  };

  const initServiceWorker = async () => {
    // if ("serviceWorker" in navigator) {
    //   navigator.serviceWorker
    //     .register("/firebase-messaging-sw.js")
    //     .then(() => {
    //       console.log("success");
    //     })
    //     .catch((error) => {
    //       console.log("error", error);
    //     });
    // }
  };

  const updateStoreFromStorage = () => {
    const storageRegion = appStorageService.getStorageAuthUserRegion();
    const storageLocation = appStorageService.getCookieLocation();
    $s_commonAction.setRegion(storageRegion as any);
    $s_commonAction.setLocation({
      latitude: storageLocation?.latitude ?? "",
      longitude: storageLocation?.longitude ?? "",
    });
  };

  const refreshCachedCountDownEndTimeStorage = (storageKey: string) => {
    const keyToCountDownEndTimeMap =
      storageService.getLocalItem<{ [key: string]: number }>(storageKey) ?? {};
    const dateTime = new Date().getTime();
    if (typeof keyToCountDownEndTimeMap === "object") {
      const newKeyToCountDownEndTimeMap = Object.entries(
        keyToCountDownEndTimeMap
      ).reduce((_newKeyToCountDownEndTimeMap, [key, countDownEndTime]) => {
        if (countDownEndTime > dateTime) {
          Object.assign(_newKeyToCountDownEndTimeMap, {
            [key]: countDownEndTime,
          });
        }
        return _newKeyToCountDownEndTimeMap;
      }, {});
      storageService.saveLocalItem(storageKey, newKeyToCountDownEndTimeMap);
    } else {
      storageService.destroyLocalItem(storageKey);
    }
  };

  const getLocation = () => {
    if (typeof window === "undefined" || router.pathname === "/apps") return;
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        $s_commonAction.setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    } else {
      console.info("Location not Available");
    }
  };

  const showVersionLog = () => {
    const logFontStyle = `
      font-family: ${theme.typography.fontFamily};
      font-size: 48px;
      font-weight: ${theme.typography.headerSemi35.fontWeight};`;

    setTimeout(
      console.log.bind(
        console,
        `%cswap%cifly\n%cv${commonConfig.APP_VERSION}`,
        `${logFontStyle}
        color: ${theme.palette.primary.main};`,
        `${logFontStyle}
        color: ${theme.palette.common.black};`,
        `font-family: ${theme.typography.fontFamily};
        font-size: 10px;
        font-weight: 500;
        color: ${theme.palette.primary.main};`
      )
    );
  };

  const checkCookie = () => {
    const cookieEnabled = navigator?.cookieEnabled;
    if (!cookieEnabled) {
      toast.warning(t("blockedCookieWarning"));
    }
  };

  useEffect(() => {
    checkCookie();
    initServiceWorker();
    showVersionLog();
    updateStoreFromStorage();
    getLocation();
    fetchSettings();
    refreshCachedCountDownEndTimeStorage(
      storageKeyConstants.SIGN_UP_EMAIL_VERIFIER_COUNTDOWN_END_TIME
    );
    refreshCachedCountDownEndTimeStorage(
      storageKeyConstants.RESET_PASSWORD_EMAIL_VERIFIER_COUNTDOWN_END_TIME
    );
    refreshCachedCountDownEndTimeStorage(
      storageKeyConstants.BIND_EMAIL_VERIFIER_COUNTDOWN_END_TIME
    );
    refreshCachedCountDownEndTimeStorage(
      storageKeyConstants.RESET_PASSWORD_PHONE_VERIFIER_COUNTDOWN_END_TIME
    );
    refreshCachedCountDownEndTimeStorage(
      storageKeyConstants.BIND_PHONE_VERIFIER_COUNTDOWN_END_TIME
    );
    return () => {
      fetchSettingsSourceRef.current?.cancel &&
        fetchSettingsSourceRef.current.cancel();
    };
  }, []);

  return null;
};

const RouterGtag = () => {
  const router = useRouter();
  const gtagPageViewEventPayloadRef = useRef<any>(null);

  useEffect(() => {
    const handleRouteChangeComplete = () => {
      const gtagPageViewEventPayload = {
        title: document.title,
        pathname: window.location.pathname,
        url: window.location.href,
      };
      if (
        _isEqual(gtagPageViewEventPayload, gtagPageViewEventPayloadRef.current)
      )
        return;
      gtagPageViewEventPayloadRef.current = gtagPageViewEventPayload;
      appGtagService.dispatchPageViewEvent(gtagPageViewEventPayload);
    };
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
    };
  }, [router.events]);

  return null;
};

const MyAppCallback = () => {
  const { t } = useTranslation();

  const checkWechatBindingCallbackResponse = async () => {
    const wechatBindingCallbackResponse =
      appStorageService.getCookieWechatBindingCallbackResponse();
    if (!!wechatBindingCallbackResponse) {
      if (wechatBindingCallbackResponse?.success)
        toast.success(t("boundWeChatSuccessfully"));
      else toast.error(wechatBindingCallbackResponse?.message);
    }
    appStorageService.destroyWechatBindingCallbackResponse();
  };

  const checkWechatSignInCallbackResponse = async () => {
    const wechatSignInCallbackResponse =
      appStorageService.getCookieWechatSignInCallbackResponse();
    if (!!wechatSignInCallbackResponse) {
      if (wechatSignInCallbackResponse?.success)
        toast.success(t("loggedSuccessfully"));
      else toast.error(wechatSignInCallbackResponse?.message);
    }
    appStorageService.destroyWechatSignInCallbackResponse();
  };

  const checkImpressionPackageOrderPaymentCallbackResponse = () => {
    const impressionPackageOrderPaymentCallbackResponse =
      appStorageService.getCookieImpressionPackageOrderPaymentCallbackResponse();
    if (!!impressionPackageOrderPaymentCallbackResponse) {
      eventBusService.dispatch(
        eventBusConstants.IMPRESSION_PACKAGE_ORDER_PAYMENT_STATUS_DIALOG_OPEN,
        {
          data: {
            product_id:
              impressionPackageOrderPaymentCallbackResponse.data?.product_id!,
            is_app_callback:
              !!impressionPackageOrderPaymentCallbackResponse.data
                ?.is_app_callback!,
          },
          success:
            !!impressionPackageOrderPaymentCallbackResponse.success &&
            !!impressionPackageOrderPaymentCallbackResponse.data?.product_id,
          message: impressionPackageOrderPaymentCallbackResponse.message,
        } as OnImpressionPackageOrderPaymentStatusDialogOpenData
      );
    }
    appStorageService.destroyImpressionPackageOrderPaymentCallbackResponse();
  };

  useEffect(() => {
    checkImpressionPackageOrderPaymentCallbackResponse();
    checkWechatBindingCallbackResponse();
    checkWechatSignInCallbackResponse();
  }, []);

  return null;
};

const MyApp: React.FunctionComponent<MyAppProps> = (props) => {
  const { Component, ...rest } = props;

  const { store, props: wrappedStoreProps } =
    reduxWrapper.useWrappedStore(rest);

  const {
    emotionCacheMui = clientSideEmotionCacheMui,
    emotionCacheApp = clientSideEmotionCacheApp,
    pageProps: { deviceType, ...pageProps },
  } = wrappedStoreProps as MyAppProps;

  const locale =
    ((pageProps?._nextI18Next?.initialLocale || "").replace(
      "-",
      ""
    ) as SupportedLocales) ||
    nextI18NextConfig.i18n.defaultLocale.replace("-", "");

  const headerLocale =
    ((pageProps?._nextI18Next?.initialLocale || "").replace(
      "-",
      "_"
    ) as string) || nextI18NextConfig.i18n.defaultLocale.replace("-", "_");

  const getLayout = Component.getLayout ?? ((page) => page);
  const translation = useTranslation();

  const themeWithLocale = useMemo(
    () =>
      createTheme(
        {
          ...theme,
          components: {
            ...theme.components,
            MuiUseMediaQuery: {
              defaultProps: {
                ssrMatchMedia:
                  deviceType === "mobile"
                    ? tabletSsrMatchMedia
                    : desktopSsrMatchMedia,
                noSsr: true,
              },
            },
          },
        },
        locales[locale]
      ),
    [theme, locale, deviceType]
  );

  const curVersion = storageService.getLocalItem("version");

  if (curVersion !== commonConfig.APP_VERSION) {
    storageService.clearLocal();
    storageService.saveLocalItem("version", commonConfig.APP_VERSION);
  }

  return (
    <>
      <Head>
        <link rel="icon" href="/favicon.svg" type="image/svg" sizes="16px" />
        <meta name="theme-color" content={theme.palette.primary.main} />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </Head>
      <DefaultSeo
        defaultTitle={commonConfig.DOCUMENT_TITLE}
        description={commonConfig.DOCUMENT_DESCRIPTION}
        titleTemplate={`%s | ${commonConfig.DOCUMENT_TITLE}`}
        facebook={{
          appId: commonConfig.FACEBOOK_APP_ID,
        }}
        openGraph={{
          type: "website",
          url: commonHelpers.getURL("/"),
          title: commonConfig.DOCUMENT_TITLE,
          description: commonConfig.DOCUMENT_DESCRIPTION,
          images: [
            {
              url: commonHelpers.getURL("/images/base-og-image.jpg"),
              alt: `${commonConfig.DOCUMENT_TITLE} - Logo`,
              type: "image/jpg",
            },
          ],
          locale: headerLocale,
          siteName: commonConfig.DOCUMENT_TITLE,
        }}
      />
      <style jsx global>{`
        html {
          font-family: ${fontApp.style.fontFamily};
        }
      `}</style>
      <Provider store={store}>
        <GoogleOAuthProvider clientId={commonConfig.GOOGLE_CLIENT_ID}>
          <CacheProvider value={emotionCacheMui}>
            <TssCacheProvider value={emotionCacheApp}>
              <ThemeProvider theme={themeWithLocale}>
                <FirebaseProvider>
                  <main className={fontApp.variable}>
                    <NoSsr>
                      <RouterLoadingLinearProgress />
                      <RouterGtag />
                      <AlertDialog />
                      <ImpressionPackageOrderPaymentStatusDialog />
                      <AppToastContainer />
                      <SignInAndSignUpDialog />
                      <LoadingScreenOverlay />
                      <CheckAuthUser />
                      <MyAppCallback />
                    </NoSsr>
                    <CssBaseline />
                    <MyAppInitialize />
                    <ErrorBoundary>
                      {getLayout(<Component {...pageProps} />, pageProps, {
                        translation,
                      })}
                    </ErrorBoundary>
                  </main>
                </FirebaseProvider>
              </ThemeProvider>
            </TssCacheProvider>
          </CacheProvider>
        </GoogleOAuthProvider>
      </Provider>
    </>
  );
};

const MyAppWithModule = appWithTranslation(MyApp, nextI18NextConfig);

export default MyAppWithModule;
