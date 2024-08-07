import { commonConfig } from "@/utils/config";

import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";
import AppContent from "@/components/AppContent";
import GeneralActionBar from "./components/GeneralActionBar";
import ProductCategoryMenu from "./components/ProductCategoryMenu";

import { useTranslation } from "next-i18next";

import useStyles from "./MainFooter.styles";

const MainFooter = () => {
  const { t } = useTranslation();

  const { classes } = useStyles();

  return (
    <footer>
      <AppContent>
        <ProductCategoryMenu />
        <div className={classes.socialMedia}>
          <AppContainer>
            <AppTypography
              className={classes.socialMediaTitle}
              variant="bodyMed16"
            >
              {t("followUs")}
            </AppTypography>
            <div className={classes.socialMediaList}>
              <AppLink
                href={commonConfig.FACEBOOK_PAGE_URL}
                variant="bodyReg16"
                underline="hover"
                target="_blank"
              >
                Facebook
              </AppLink>
              <AppTypography variant="bodyReg16">•</AppTypography>
              <AppLink
                href={commonConfig.INSTAGRAM_PAGE_URL}
                variant="bodyReg16"
                underline="hover"
                target="_blank"
              >
                Instagram
              </AppLink>
              <AppTypography variant="bodyReg16">•</AppTypography>
              <AppLink
                href={commonConfig.LINKED_PAGE_URL}
                variant="bodyReg16"
                underline="hover"
                target="_blank"
              >
                Linkedin
              </AppLink>
            </div>
          </AppContainer>
        </div>
      </AppContent>
      <GeneralActionBar />
    </footer>
  );
};

export default MainFooter;
