import nextI18nextConfig from "@@/next-i18next.config";

import { Dialog, DialogContent, LinearProgress, NoSsr } from "@mui/material";
import LogoImage from "@/components/LogoImage/LogoImage";

import { useEffect, useMemo, useRef } from "react";
import { useAppSelector, useAuthUser } from "@/hooks";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import useStyles from "./AuthGuard.styles";

type AuthGuardProps = {
  children?: any;
  requiredAuth?: boolean;
};

const LoadingFullScreen = (props: {
  loading?: boolean;
  children?: React.ReactNode;
}) => {
  const { loading, children } = props;

  const { classes } = useStyles();

  return (
    <>
      <NoSsr>
        <Dialog className={classes.loadingDialog} open={!!loading} fullScreen>
          <DialogContent className={classes.loading}>
            <div className={classes.loadingContent}>
              <LogoImage
                className={classes.loadingContentLogo}
                variant="textLogo"
              />
              <LinearProgress className={classes.loadingLinearProgress} />
            </div>
          </DialogContent>
        </Dialog>
      </NoSsr>
      {!loading && children}
    </>
  );
};

const CheckAuth = (props: AuthGuardProps & { loading?: boolean }) => {
  const { requiredAuth, loading } = props;

  const { i18n } = useTranslation();

  const router = useRouter();

  const isReadyAuthRef = useRef(false);

  const { hasAuth, authChecking, openSignInAndSignUpDialog } = useAuthUser();
  const $s_isUserAuthExpiredToken = useAppSelector(
    (state) => state.auth.isUserAuthExpiredToken
  );

  const pathname =
    typeof window !== "undefined" ? window.location.pathname.toLowerCase() : "";

  const unAuthPaths = useMemo(() => {
    const pathResults: string[] = [];
    const locales = ["", ...nextI18nextConfig.i18n.locales];
    locales.forEach((locale) => {
      [].forEach((path) => {
        pathResults.push(
          `${!!locale ? `/${locale.toLowerCase()}` : ""}${path}`
        );
      });
    });
    return pathResults;
  }, []);

  useEffect(() => {
    if (!authChecking && !loading) {
      if (!unAuthPaths.includes(pathname) && !hasAuth && !!requiredAuth) {
        if (!!isReadyAuthRef.current && !$s_isUserAuthExpiredToken) {
          router.push("/");
        } else openSignInAndSignUpDialog();
      }
      isReadyAuthRef.current = true;
    }
  }, [
    hasAuth,
    authChecking,
    pathname,
    i18n.language,
    requiredAuth,
    loading,
    $s_isUserAuthExpiredToken,
  ]);

  return null;
};

const AuthGuard = (props: AuthGuardProps) => {
  const { children } = props;

  const $s_userAuthChecking = useAppSelector(
    (state) => state.auth.userAuthChecking
  );
  const $s_settingsLoading = useAppSelector(
    (state) => state.common.settingsLoading
  );
  const $s_cookieTokenLoading = useAppSelector(
    (state) => state.common.cookieTokenLoading
  );

  const loading = useMemo(() => {
    return $s_userAuthChecking || $s_settingsLoading || $s_cookieTokenLoading;
  }, [$s_userAuthChecking, $s_settingsLoading, $s_cookieTokenLoading]);

  return (
    <>
      <CheckAuth {...props} loading={loading} />
      <LoadingFullScreen loading={loading}>{children}</LoadingFullScreen>
    </>
  );
};

export default AuthGuard;
