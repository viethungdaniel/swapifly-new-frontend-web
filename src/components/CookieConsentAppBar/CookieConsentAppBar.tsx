import { storageKeyConstants } from "@/utils/constants";
import { storageService } from "@/services";

import { AppBar, Slide, Toolbar, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppTypography from "@/components/AppTypography";
import AppButton from "@/components/AppButton";
import AppLink from "@/components/AppLink";
import { Trans, useTranslation } from "next-i18next";

import { useState } from "react";

import useStyles from "./CookieConsentAppBar.styles";

const CookieConsentAppBar = () => {
  const [cookieConsentAppBarIn, setCookieConsentAppBarIn] = useState(
    !storageService.getCookieItem(storageKeyConstants.COOKIE_CONSENT)
  );

  const { classes, theme } = useStyles();

  const { t } = useTranslation();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const handleCookieConsentAccept = () => {
    const now = new Date();
    const time = now.getTime();
    const expireTime = time + 1000 * (24 * 60 * 60);
    now.setTime(expireTime);

    storageService.saveCookieItem(storageKeyConstants.COOKIE_CONSENT, true, {
      expires: now,
    });
    setCookieConsentAppBarIn(false);
  };

  return (
    <>
      <Slide appear={false} direction="up" in={cookieConsentAppBarIn}>
        <AppBar
          className={classes.root}
          elevation={0}
          color="default"
          position="fixed"
          component="div"
        >
          <AppContainer>
            <Toolbar
              className={classes.toolbar}
              sx={{ gap: 2.5 }}
              disableGutters
            >
              <AppTypography flex={1}>
                <Trans
                  t={t}
                  defaults="cookieAdvantageMessage"
                  components={{
                    a1: (
                      <AppLink
                        href="/terms-of-service"
                        color="common.blue"
                        hoverColor="common.blue"
                      />
                    ),
                    a2: (
                      <AppLink
                        href="/privacy-policy"
                        color="common.blue"
                        hoverColor="common.blue"
                      />
                    ),
                  }}
                />
              </AppTypography>
              <AppButton
                variant="contained"
                color="success.main"
                onClick={handleCookieConsentAccept}
              >
                {t("agree")}
              </AppButton>
            </Toolbar>
          </AppContainer>
        </AppBar>
      </Slide>

      {cookieConsentAppBarIn && !isTabletDown && (
        <Toolbar
          className={classes.toolbar}
          sx={{ gap: 2.5 }}
          disableGutters
        ></Toolbar>
      )}
    </>
  );
};

export default CookieConsentAppBar;
