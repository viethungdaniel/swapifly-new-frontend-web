import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import { loadingScreenOverlayService } from "@/services";
import { useContext, useMemo } from "react";
import { storeAuthAction } from "@/store";
import { axiosHelpers, reduxHelpers } from "@/utils/helpers";

import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import GoogleSvg from "@@/public/images/svgs/google.svg";

import { useGoogleLogin } from "@react-oauth/google";
import { useAppDispatch, useEventCallback, useIsMounted } from "@/hooks";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import type { AppButtonProps } from "@/components/AppButton";
import type { UseGoogleLoginOptionsAuthCodeFlow } from "@react-oauth/google";

type SignInGoogleButtonProps = Omit<
  AppButtonProps,
  "children" | "variant" | "color" | "fullWidth" | "startIcon"
>;

const SignInGoogleButton = (props: SignInGoogleButtonProps) => {
  const { onClick, ...rest } = props;

  const { signInAndSignUpDialogOpenPayload, handleSignInAndSignUpDialogClose } =
    useContext(SignInAndSignUpDialogContext);

  const router = useRouter();

  const { t } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const handleGoogleLoginSuccess = useEventCallback<
    NonNullable<UseGoogleLoginOptionsAuthCodeFlow["onSuccess"]>
  >(async (codeResponse) => {
    if (!codeResponse.code || !isMounted()) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);

    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.signInWithGoogleSaga,
      {
        params: {
          code: codeResponse.code,
        },
      }
    );
    if (!isMounted()) return;

    if (axiosHelpers.checkRequestSuccess(response)) {
      toast.success(t("loggedSuccessfully"));

      if (!!signInAndSignUpDialogOpenPayload?.href) {
        router.push(signInAndSignUpDialogOpenPayload.href);
      } else router.push(router, undefined, { scroll: false });
      handleSignInAndSignUpDialogClose();
    } else {
      toast.error(response.message);
    }

    loadingScreenOverlayService.close();
  });

  const login = useGoogleLogin({
    flow: "auth-code",
    onSuccess: handleGoogleLoginSuccess,
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    onClick && onClick(event);
    login();
  };

  const isMounted = useIsMounted();

  return (
    <AppButton
      {...rest}
      variant="outlined"
      color="text.secondary"
      fullWidth
      noWrap
      startIcon={<AppSvgIcon component={GoogleSvg} fontSize="inherit" />}
      onClick={handleClick}
    >
      {t("continueWithGoogle")}
    </AppButton>
  );
};

export default SignInGoogleButton;
