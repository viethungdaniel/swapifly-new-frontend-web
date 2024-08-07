import AppDialogContent from "@/components/AppDialogContent";
import AppDialogTitle from "@/components/AppDialogTitle";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import LoadingOverlay from "@/components/LoadingOverlay";
import HtmlParser from "@/components/HtmlParser";

import ArrowLeftIcon from "@@/public/images/icons/arrow-left.svg";

import SignInAndSignUpDialogContext from "@/containers/SignInAndSignUpDialog/SignInAndSignUpDialog.context";

import { useContext } from "react";
import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

const ViewTermsOfService = () => {
  const { handleViewSignUpPush, handleSignInAndSignUpDialogClose } = useContext(
    SignInAndSignUpDialogContext
  );

  const { t } = useTranslation();

  const $s_termsOfService = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicy.termsOfService
  );
  const $s_termsOfServiceLoading = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicyLoading
  );
  const $s_termsOfServiceError = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicyError
  );

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
        {t("termsOfService")}
      </AppDialogTitle>
      <AppDialogContent>
        <LoadingOverlay
          loading={$s_termsOfServiceLoading || !!$s_termsOfServiceError}
        >
          <HtmlParser html={$s_termsOfService} />
        </LoadingOverlay>
      </AppDialogContent>
    </>
  );
};

export default ViewTermsOfService;
