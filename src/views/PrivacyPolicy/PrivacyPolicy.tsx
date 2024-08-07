import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent/AppContent";
import LoadingOverlay from "@/components/LoadingOverlay";
import HtmlParser from "@/components/HtmlParser";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

const PrivacyPolicy = () => {
  const { t } = useTranslation();

  const $s_privacyPolicy = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicy.privacyPolicy
  );
  const $s_privacyPolicyLoading = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicyLoading
  );
  const $s_privacyPolicyError = useAppSelector(
    (state) => state.common.termsOfServiceAndPrivacyPolicyError
  );

  return (
    <AppContent>
      <AppContainer sx={{ mb: 2.5 }}>
        <AppTypography variant="titleSemi20">
          {t("privacyPolicy")}
        </AppTypography>
      </AppContainer>

      <AppContainer>
        <LoadingOverlay
          loading={$s_privacyPolicyLoading || !!$s_privacyPolicyError}
        >
          <HtmlParser html={$s_privacyPolicy} />
        </LoadingOverlay>
      </AppContainer>
    </AppContent>
  );
};

export default PrivacyPolicy;
