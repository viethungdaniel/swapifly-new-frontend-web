import { commonConfig } from "@/utils/config";

import { ButtonBase, Grid, NoSsr, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppImage from "@/components/AppImage";
import AppTypography from "@/components/AppTypography";
import AppStoreButtonSvg from "@@/public/images/svgs/app-store-button.svg";
import GooglePlayButtonSvg from "@@/public/images/svgs/google-play-button.svg";
import QRCode from "qrcode.react";

import { useAppLink } from "@/hooks";
import { useTranslation } from "next-i18next";

import useStyles from "./SectionAppIntroBanner.styles";

const SectionAppIntroBanner = () => {
  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const qrCodeAppLink = `${commonConfig.BASE_URL}apps`;
  const iOSAppLink = useAppLink({ variant: "iOS" });
  const androidAppLink = useAppLink({ variant: "android" });

  const { t } = useTranslation();

  if (isTabletDown) return null;

  return (
    <div className={classes.root}>
      <div className={classes.main}>
        <AppContainer>
          <Grid container alignItems="center">
            <Grid
              item
              xs={12}
              md={6}
              display="flex"
              justifyContent="flex-end"
              alignItems="center"
            >
              <AppImage
                className={classes.thumbnail}
                src={"/images/pages/home/app-intro-thumbnail.png"}
                width={500}
                height={500}
                quality={100}
                alt={"app store, google play"}
                objectFit="contain"
                objectPosition="center"
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <div className={classes.content}>
                <AppTypography variant="headerSemi35" marginBottom={1}>
                  {t("smartAppBannerDownloadAppTitle")}
                </AppTypography>
                <AppTypography variant="titleReg20" marginBottom={3}>
                  {t("smartAppBannerContent")}
                </AppTypography>
                <Grid container spacing={2}>
                  <Grid item xs="auto">
                    <Grid container spacing={2} flexDirection="column">
                      <Grid item xs={"auto"}>
                        <ButtonBase
                          className={classes.appStoreButton}
                          component="a"
                          target="_blank"
                          href={iOSAppLink}
                        >
                          <AppStoreButtonSvg className={classes.appStoreSvg} />
                        </ButtonBase>
                      </Grid>
                      <Grid item xs={"auto"}>
                        <ButtonBase
                          className={classes.appStoreButton}
                          component="a"
                          target="_blank"
                          href={androidAppLink}
                        >
                          <GooglePlayButtonSvg
                            className={classes.appStoreSvg}
                          />
                        </ButtonBase>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid item xs="auto">
                    <NoSsr>
                      <div className={classes.qrCode}>
                        <QRCode
                          className={classes.qrCodeCanvas}
                          value={qrCodeAppLink}
                          size={50 * 2 + 16}
                          imageSettings={{
                            src: "/images/rounded-app-logo.svg",
                            width: (50 * 2 + 16) * 0.2,
                            height: (50 * 2 + 16) * 0.2,
                            excavate: true,
                          }}
                        />
                      </div>
                    </NoSsr>
                  </Grid>
                </Grid>
              </div>
            </Grid>
          </Grid>
        </AppContainer>
      </div>
    </div>
  );
};

export default SectionAppIntroBanner;
