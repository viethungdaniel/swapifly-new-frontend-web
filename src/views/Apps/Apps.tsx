import { ButtonBase } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppImage from "@/components/AppImage";
import AppLink from "@/components/AppLink";
import AppTypography from "@/components/AppTypography";

import { useAppLink } from "@/hooks";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import useStyles from "./Apps.styles";
const Apps = () => {
  const [pageShow, setPageShow] = useState(false);

  const router = useRouter();

  useAppLink({
    autoRedirect: true,
  });

  const { classes } = useStyles();

  const { t } = useTranslation();

  useEffect(() => {
    setPageShow(router.isReady);
  }, [router.isReady]);

  if (!pageShow) return;
  return (
    <div className={classes.root}>
      <AppContainer>
        <div className={classes.content}>
          <AppTypography className={classes.title}>Swapifly app</AppTypography>
          <ButtonBase
            className={classes.homeBackButton}
            component={AppLink}
            underline="none"
            hoverColor="none"
            href="/"
          >
            {t("goBackHome")}
          </ButtonBase>
          <AppImage
            className={classes.thumbnailImg}
            src={"/images/pages/home/app-intro-thumbnail.png"}
            width={500}
            height={500}
            quality={100}
            alt={"app store, google play"}
            objectFit="contain"
            objectPosition="center"
          />
        </div>
      </AppContainer>
    </div>
  );
};

export default Apps;
