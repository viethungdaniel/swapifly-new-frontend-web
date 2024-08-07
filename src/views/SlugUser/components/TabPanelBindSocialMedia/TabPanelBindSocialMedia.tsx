import { toast } from "react-toastify";
import { bindActionCreators } from "redux";
import axios from "axios";

import { storeAuthAction } from "@/store";
import { alertDialogService, loadingScreenOverlayService } from "@/services";
import { axiosHelpers, commonHelpers, reduxHelpers } from "@/utils/helpers";
import { commonConfig } from "@/utils/config";

import { Divider, Skeleton, useMediaQuery } from "@mui/material";
import AppTypography from "@/components/AppTypography";
import AppToolbar from "@/components/AppToolbar";
import FacebookLogin from "@greatsumini/react-facebook-login";
import AppButton from "@/components/AppButton";
import AppList from "@/components/AppList";
import AppListItem from "@/components/AppListItem";
import AppListItemIcon from "@/components/AppListItemIcon";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppListItemText from "@/components/AppListItemText";
import AppListItemButton from "@/components/AppListItemButton";

import AppleSvg from "@@/public/images/svgs/apple.svg";
import FacebookOriginalSvg from "@@/public/images/svgs/facebook-original.svg";
import GoogleSvg from "@@/public/images/svgs/google.svg";
import WeChatSvg from "@@/public/images/svgs/wechat.svg";
import ArrowRightSvg from "@@/public/images/icons/arrow-right.svg";

import { useTranslation } from "next-i18next";
import { useEffect, useMemo, useRef } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import {
  useAppDispatch,
  useAppSelector,
  useEventCallback,
  useIsMounted,
} from "@/hooks";

import { useRouter } from "next/router";
import useStyles from "./TabPanelBindSocialMedia.styles";

import type { UseGoogleLoginOptionsAuthCodeFlow } from "@react-oauth/google";
import type { CancelTokenSource } from "axios";
import type { SuccessResponse } from "@greatsumini/react-facebook-login";

const BINDING_CONFIRMATION_MESSAGE = "bindMediaSocialConfirmationContent";

const GoogleBindingButton = () => {
  const unbindGoogleSourceRef = useRef<CancelTokenSource | null>(null);
  const bindGoogleSourceRef = useRef<CancelTokenSource | null>(null);

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUserLoginInfoLoginGoogle = useAppSelector(
    (state) => !!state.auth.userLoginInfo?.login_google
  );
  const $s_authUserLoginInfoLoginMethodCount = useAppSelector(
    (state) => state.auth.userLoginInfo?.count_login_methods
  );

  const { classes } = useStyles();

  const handleGoogleLoginSuccess = useEventCallback<
    NonNullable<UseGoogleLoginOptionsAuthCodeFlow["onSuccess"]>
  >(async (codeResponse) => {
    if (!codeResponse.code || !isMounted()) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);
    bindGoogleSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.bindGoogleSaga,
      {
        params: {
          code: codeResponse.code,
        },
        cancelToken: bindGoogleSourceRef.current.token,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("bindGoogleSuccessfully"));
    } else {
      toast.error(response.message);
    }

    loadingScreenOverlayService.close();
  });

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleGoogleLoginSuccess,
  });

  const handleGoogleBindingClick = async () => {
    if (!!$s_authUserLoginInfoLoginGoogle) return;
    const alertResponse = await alertDialogService.fire({
      title: t("bindGoogle"),
      content: BINDING_CONFIRMATION_MESSAGE,
    });
    if (!alertResponse.isConfirmed) return;
    login();
  };

  const handleGoogleUnbindingClick = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("unlinkGoogleConfirmationTitle"),
      content: t("unlinkGoogleConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    unbindGoogleSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.unbindGoogleSaga,
      {
        cancelToken: unbindGoogleSourceRef.current.token,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("unlinkGoogleSuccessfully"));
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    return () => {
      unbindGoogleSourceRef.current?.cancel &&
        unbindGoogleSourceRef.current.cancel();
      bindGoogleSourceRef.current?.cancel &&
        bindGoogleSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <AppListItemButton
      className={classes.socialMediaItem}
      disableRipple={!!$s_authUserLoginInfoLoginGoogle}
      disableTouchRipple={!!$s_authUserLoginInfoLoginGoogle}
      disableHover={!!$s_authUserLoginInfoLoginGoogle}
      onClick={handleGoogleBindingClick}
    >
      <AppListItemIcon>
        <AppSvgIcon component={GoogleSvg} />
      </AppListItemIcon>
      <AppListItemText primary="Google" />
      {$s_authUserLoginInfoLoginGoogle ? (
        <>
          {($s_authUserLoginInfoLoginMethodCount ?? 0) > 1 && (
            <AppButton
              variant="text"
              color="primary"
              edge="end"
              onClick={handleGoogleUnbindingClick}
            >
              {t("unlink")}
            </AppButton>
          )}
        </>
      ) : (
        <AppSvgIcon component={ArrowRightSvg} />
      )}
    </AppListItemButton>
  );
};

const FacebookBindingButton = () => {
  const unbindFacebookSourceRef = useRef<CancelTokenSource | null>(null);
  const bindFacebookSourceRef = useRef<CancelTokenSource | null>(null);

  const { t, i18n } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUserLoginInfoLoginFacebook = useAppSelector(
    (state) => !!state.auth.userLoginInfo?.login_facebook
  );
  const $s_authUserLoginInfoLoginMethodCount = useAppSelector(
    (state) => state.auth.userLoginInfo?.count_login_methods
  );

  const { classes } = useStyles();

  const handleFacebookResponse = async (userInfo: SuccessResponse) => {
    if (!userInfo.accessToken || !isMounted()) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);
    bindFacebookSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.bindFacebookSaga,
      {
        params: {
          accessToken: userInfo.accessToken,
        },
        cancelToken: bindFacebookSourceRef.current.token,
      }
    );
    if (!isMounted()) return;

    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("bindFacebookSuccessfully"));
    } else {
      toast.error(response.message);
    }

    loadingScreenOverlayService.close();
  };

  const handleFacebookUnbindingClick = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("unlinkFacebookConfirmationTitle"),
      content: t("unlinkFacebookConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    unbindFacebookSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.unbindFacebookSaga,
      {
        cancelToken: unbindFacebookSourceRef.current.token,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("unlinkFacebookSuccessfully"));
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    return () => {
      unbindFacebookSourceRef.current?.cancel &&
        unbindFacebookSourceRef.current.cancel();
      bindFacebookSourceRef.current?.cancel &&
        bindFacebookSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <FacebookLogin
      appId={commonConfig.FACEBOOK_APP_ID}
      language={i18n.language.replace("-", "_")}
      onSuccess={handleFacebookResponse}
      render={({ onClick }) => (
        <AppListItemButton
          className={classes.socialMediaItem}
          divider
          disableRipple={!!$s_authUserLoginInfoLoginFacebook}
          disableTouchRipple={!!$s_authUserLoginInfoLoginFacebook}
          disableHover={!!$s_authUserLoginInfoLoginFacebook}
          onClick={async () => {
            if (!!$s_authUserLoginInfoLoginFacebook) return;
            const { isConfirmed } = await alertDialogService.fire({
              title: t("bindFacebook"),
              content: t(BINDING_CONFIRMATION_MESSAGE),
            });
            if (!isConfirmed) return;
            onClick && onClick();
          }}
        >
          <AppListItemIcon>
            <AppSvgIcon component={FacebookOriginalSvg} />
          </AppListItemIcon>
          <AppListItemText primary="Facebook" />
          {$s_authUserLoginInfoLoginFacebook ? (
            <>
              {($s_authUserLoginInfoLoginMethodCount ?? 0) > 1 && (
                <AppButton
                  variant="text"
                  color="primary"
                  edge="end"
                  onClick={handleFacebookUnbindingClick}
                >
                  {t("unlink")}
                </AppButton>
              )}
            </>
          ) : (
            <AppSvgIcon component={ArrowRightSvg} />
          )}
        </AppListItemButton>
      )}
    />
  );
};

const AppleBindingItem = () => {
  const unbindAppleSourceRef = useRef<CancelTokenSource | null>(null);

  const dispatch = useAppDispatch();

  const { t } = useTranslation();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUserLoginInfoLoginApple = useAppSelector(
    (state) => !!state.auth.userLoginInfo?.login_apple
  );
  const $s_authUserLoginInfoLoginMethodCount = useAppSelector(
    (state) => state.auth.userLoginInfo?.count_login_methods
  );

  const { classes } = useStyles();

  const handleAppleBindingClick = () => {
    if (!!$s_authUserLoginInfoLoginApple) return;
    alertDialogService.fire({
      title: t("alertAppleBindingConfirmationTitle"),
      content: t("alertAppleBindingConfirmationContent"),
      actions: [
        {
          children: t("iUnderstand"),
          buttonProps: {
            variant: "contained",
            color: "text.primary",
          },
        },
      ],
    });
  };

  const handleAppleUnbindingClick = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("unlinkAppleConfirmationTitle"),
      content: t("unlinkAppleConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    unbindAppleSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.unbindAppleSaga,
      {
        cancelToken: unbindAppleSourceRef.current.token,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("unlinkAppleSuccessfully"));
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    return () => {
      unbindAppleSourceRef.current?.cancel &&
        unbindAppleSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <AppListItemButton
      className={classes.socialMediaItem}
      divider
      disableRipple={!!$s_authUserLoginInfoLoginApple}
      disableTouchRipple={!!$s_authUserLoginInfoLoginApple}
      disableHover={!!$s_authUserLoginInfoLoginApple}
      onClick={handleAppleBindingClick}
    >
      <AppListItemIcon>
        <AppSvgIcon component={AppleSvg} />
      </AppListItemIcon>
      <AppListItemText primary="Apple" />
      {$s_authUserLoginInfoLoginApple ? (
        <>
          {($s_authUserLoginInfoLoginMethodCount ?? 0) > 1 && (
            <AppButton
              variant="text"
              color="primary"
              edge="end"
              onClick={handleAppleUnbindingClick}
            >
              {t("unlink")}
            </AppButton>
          )}
        </>
      ) : (
        <AppSvgIcon component={ArrowRightSvg} />
      )}
    </AppListItemButton>
  );
};

const WeChatBindingItem = () => {
  const unbindWeChatSourceRef = useRef<CancelTokenSource | null>(null);

  const router = useRouter();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_authUserLoginInfoLoginWeChat = useAppSelector(
    (state) => !!state.auth.userLoginInfo?.login_wechat
  );
  const $s_authUserLoginInfoLoginMethodCount = useAppSelector(
    (state) => state.auth.userLoginInfo?.count_login_methods
  );

  const { classes } = useStyles();

  const handleWeChatBindingClick = async () => {
    if (commonHelpers.isMobile()) {
      alertDialogService.fire({
        title: t("alertWebAppWeChatBindingConfirmationTitle"),
        content: t("alertWebAppWeChatBindingConfirmationContent"),
        actions: [
          {
            children: t("iUnderstand"),
            buttonProps: {
              variant: "contained",
              color: "text.primary",
            },
          },
        ],
      });
      return;
    }
    if (!!$s_authUserLoginInfoLoginWeChat || !router.isReady) return;
    const alertResponse = await alertDialogService.fire({
      title: t("bindWeChat"),
      content: t(BINDING_CONFIRMATION_MESSAGE),
    });
    if (!alertResponse.isConfirmed) return;
    window.location.href = `/api/auth/wechat/qrconnect?redirect_path=${router.asPath}&language=${router.locale}&context=binding`;
  };

  const handleWeChatUnbindingClick = async () => {
    const { isConfirmed } = await alertDialogService.fire({
      title: t("unlinkWeChatConfirmationTitle"),
      content: t("unlinkWeChatConfirmationContent"),
    });
    if (!isConfirmed) return;
    loadingScreenOverlayService.fire(`${t("pending")}...`);
    unbindWeChatSourceRef.current = axios.CancelToken.source();
    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.unbindWeChatSaga,
      {
        cancelToken: unbindWeChatSourceRef.current.token,
      }
    );
    if (!isMounted()) return;
    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("unlinkWeChatSuccessfully"));
    } else {
      toast.error(response.message);
    }
    loadingScreenOverlayService.close();
  };

  useEffect(() => {
    return () => {
      unbindWeChatSourceRef.current?.cancel &&
        unbindWeChatSourceRef.current.cancel();
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <AppListItemButton
      className={classes.socialMediaItem}
      divider
      disableRipple={!!$s_authUserLoginInfoLoginWeChat}
      disableTouchRipple={!!$s_authUserLoginInfoLoginWeChat}
      disableHover={!!$s_authUserLoginInfoLoginWeChat}
      onClick={handleWeChatBindingClick}
    >
      <AppListItemIcon>
        <AppSvgIcon component={WeChatSvg} />
      </AppListItemIcon>
      <AppListItemText primary="WeChat" />
      {$s_authUserLoginInfoLoginWeChat ? (
        <>
          {($s_authUserLoginInfoLoginMethodCount ?? 0) > 1 && (
            <AppButton
              variant="text"
              color="primary"
              edge="end"
              onClick={handleWeChatUnbindingClick}
            >
              {t("unlink")}
            </AppButton>
          )}
        </>
      ) : (
        <AppSvgIcon component={ArrowRightSvg} />
      )}
    </AppListItemButton>
  );
};

const TabPanelBindSocialMedia = () => {
  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const $s_authUserLoginInfoLoading = useAppSelector(
    (state) => state.auth.userLoginInfoLoading
  );
  const $s_authUserLoginInfoError = useAppSelector(
    (state) => state.auth.userLoginInfoError
  );

  const authUserLoginInfoLoading = useMemo(() => {
    return $s_authUserLoginInfoLoading || !!$s_authUserLoginInfoError;
  }, [$s_authUserLoginInfoLoading, $s_authUserLoginInfoError]);

  return (
    <div>
      {!isTabletDown && (
        <>
          <AppToolbar>
            <AppTypography
              className={classes.title}
              variant="titleSemi20"
              noWrap
            >
              <span>{t("bindSocialMedia")}</span>
            </AppTypography>
          </AppToolbar>
          <Divider />
        </>
      )}
      <AppList>
        {authUserLoginInfoLoading && (
          <>
            {[...Array.from(Array(3)).keys()].map((key) => (
              <AppListItem
                key={key}
                className={classes.socialMediaItem}
                divider={key !== 2}
              >
                <AppListItemIcon>
                  <Skeleton
                    variant="rectangular"
                    sx={{ width: 24, height: 24 }}
                  />
                </AppListItemIcon>
                <Skeleton
                  variant="text"
                  sx={{ width: 120, maxWidth: "100%" }}
                />
              </AppListItem>
            ))}
          </>
        )}
        {!authUserLoginInfoLoading && (
          <>
            <AppleBindingItem />
            <FacebookBindingButton />
            <WeChatBindingItem />
            <GoogleBindingButton />
          </>
        )}
      </AppList>
    </div>
  );
};

export default TabPanelBindSocialMedia;
