import { useGoogleOneTapLogin } from "@react-oauth/google";
import { toast } from "react-toastify";
import { bindActionCreators } from "redux";

import { storeAuthAction } from "@/store";
import { axiosHelpers, reduxHelpers } from "@/utils/helpers";
import { loadingScreenOverlayService } from "@/services";

import { useMemo } from "react";
import { useAppDispatch, useAppSelector, useIsMounted } from "@/hooks";
import { useTranslation } from "next-i18next";

import type { GoogleLoginProps } from "@react-oauth/google";

const GoogleOneTabLogin = () => {
  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const $s_hasAuth = useAppSelector((state) => !!state.auth.user?.id);

  const handleGoogleSignIn: GoogleLoginProps["onSuccess"] = async (
    googleResponse
  ) => {
    if (!googleResponse.credential || !isMounted()) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);

    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.signInWithGoogleIDTokenSaga,
      {
        params: {
          id_token: googleResponse.credential,
        },
      }
    );
    if (!isMounted()) return;

    if (!axiosHelpers.checkRequestSuccess(response)) {
      toast.error(response.message);
    }

    loadingScreenOverlayService.close();
  };

  useGoogleOneTapLogin({
    cancel_on_tap_outside: false,
    disabled: $s_hasAuth,
    onSuccess: handleGoogleSignIn,
  });

  const isMounted = useIsMounted();

  return null;
};

export default GoogleOneTabLogin;
