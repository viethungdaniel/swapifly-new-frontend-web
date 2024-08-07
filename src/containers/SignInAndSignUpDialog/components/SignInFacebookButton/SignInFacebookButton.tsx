import { bindActionCreators } from "redux";
import { toast } from "react-toastify";

import { commonConfig } from "@/utils/config";
import { loadingScreenOverlayService } from "@/services";
import { axiosHelpers, reduxHelpers } from "@/utils/helpers";
import { storeAuthAction } from "@/store";

import AppButton from "@/components/AppButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import FacebookLogin from "@greatsumini/react-facebook-login";

import FacebookSvg from "@@/public/images/svgs/facebook.svg";

import { useAppDispatch, useIsMounted } from "@/hooks";
import { useContext, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import type { AppButtonProps } from "@/components/AppButton";
import type { SuccessResponse } from "@greatsumini/react-facebook-login";

type SignInFacebookButtonProps = Omit<
  AppButtonProps,
  "children" | "variant" | "color" | "fullWidth" | "startIcon"
>;

const SignInFacebookButton = (props: SignInFacebookButtonProps) => {
  const { onClick, ...rest } = props;

  const { signInAndSignUpDialogOpenPayload, handleSignInAndSignUpDialogClose } =
    useContext(SignInAndSignUpDialogContext);

  const router = useRouter();

  const { t, i18n } = useTranslation();

  const dispatch = useAppDispatch();

  const $s_authAction = useMemo(
    () => bindActionCreators(storeAuthAction, dispatch),
    [dispatch]
  );

  const handleClick: AppButtonProps["onClick"] = (event) => {
    onClick && onClick(event);
  };

  const handleFacebookResponse = async (userInfo: SuccessResponse) => {
    if (!userInfo.accessToken || !isMounted()) return;

    loadingScreenOverlayService.fire(`${t("pending")}...`);

    const response = await reduxHelpers.callActionWithPromise(
      $s_authAction.signInWithFacebookSaga,
      {
        params: {
          accessToken: userInfo.accessToken,
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
  };

  const isMounted = useIsMounted();

  return (
    <FacebookLogin
      appId={commonConfig.FACEBOOK_APP_ID}
      language={i18n.language.replace("-", "_")}
      onSuccess={handleFacebookResponse}
      render={({ onClick }) => (
        <AppButton
          {...rest}
          variant="contained"
          color="common.blue"
          fullWidth
          noWrap
          startIcon={<AppSvgIcon component={FacebookSvg} fontSize="inherit" />}
          onClick={(event) => {
            handleClick(event);
            onClick && onClick();
          }}
        >
          {t("continueWithFacebook")}
        </AppButton>
      )}
    />
  );
};

export default SignInFacebookButton;
