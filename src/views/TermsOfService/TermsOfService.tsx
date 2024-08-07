import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent/AppContent";
import LoadingOverlay from "@/components/LoadingOverlay";
import HtmlParser from "@/components/HtmlParser";

import { useAppSelector } from "@/hooks";
import { useTranslation } from "next-i18next";

const TermsOfService = () => {
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
    <AppContent>
      <AppContainer sx={{ mb: 2.5 }}>
        <AppTypography variant="titleSemi20">
          {t("termOfService")}
        </AppTypography>
      </AppContainer>

      <AppContainer>
        <LoadingOverlay
          loading={$s_termsOfServiceLoading || !!$s_termsOfServiceError}
        >
          <HtmlParser html={$s_termsOfService} />
        </LoadingOverlay>
      </AppContainer>
    </AppContent>
  );
};

export default TermsOfService;
