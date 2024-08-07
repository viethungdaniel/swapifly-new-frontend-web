import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import LoadingOverlay from "@/components/LoadingOverlay";
import HtmlParser from "@/components/HtmlParser";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import { useContext } from "react";
import { useTranslation } from "next-i18next";
import { useAppSelector } from "@/hooks";

const ViewPrivacyPolicy = () => {
  const { handleSignInAndSignUpDialogClose, handleViewSignUpPush } = useContext(
    SignInAndSignUpDialogContext
  );

  const $s_privacyPolicy = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicy.privacyPolicy
  );
  const $s_privacyPolicyLoading = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicyLoading
  );
  const $s_privacyPolicyError = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicyError
  );

  const { t } = useTranslation();

  return (
    <>
      <AppDialogTitle
        startActions={
          <AppIconButton
            edge="xy"
            color="text.primary"
            borderRadius="circular"
            onClick={handleViewSignUpPush}
          >
            <AppSvgIcon component={ArrowLeftIcon} fontSize="small" />
          </AppIconButton>
        }
        onCloseButtonClick={handleSignInAndSignUpDialogClose}
      >
        {t("privacyPolicy")}
      </AppDialogTitle>
      <AppDialogContent>
        <LoadingOverlay
          loading={$s_privacyPolicyLoading || !!$s_privacyPolicyError}
        >
          <HtmlParser html={$s_privacyPolicy} />
        </LoadingOverlay>
      </AppDialogContent>
    </>
  );
};

export default ViewPrivacyPolicy;
