import AppButton from "@/components/AppButton";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";

import N404Svg from "@@/public/images/svgs/404.svg";

import { useTranslation } from "next-i18next";

import useStyles from "./404.styles";

const _404 = () => {
  const { classes } = useStyles();

  const { t } = useTranslation();

  return (
    <AppContainer className={classes.root} maxWidth="sm">
      <div className={classes.content}>
        <AppTypography
          variant="headerSemi35"
          align="center"
          textTransform="capitalize"
          marginBottom={6}
        >
          {t("pageNotfound")}
        </AppTypography>
        <N404Svg className={classes.n404Svg} />
        <AppTypography
          variant="bodyReg16"
          align="center"
          marginBottom={6}
          whiteSpace="pre-wrap"
        >
          {t("pageNotFoundContent")}
        </AppTypography>
        <AppButton
          fullWidth
          noWrap
          variant="contained"
          color="primary"
          component={AppLink}
          underline="none"
          hoverColor="none"
          href="/"
          sx={{ width: 320, maxWidth: "100%" }}
        >
          {t("goBackHome")}
        </AppButton>
      </div>
    </AppContainer>
  );
};

export default _404;
