import { Box, NoSsr, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import LogoImage from "@/components/LogoImage";

import { useContext } from "react";
import { useTranslation } from "next-i18next";

import PortalContext from "@/layouts/Portal/Portal.context";

import useStyles from "./PortalFooter.styles";

const PortalFooter = () => {
  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const { variantState } = useContext(PortalContext);

  const { t } = useTranslation();

  return (
    <section className={classes.root}>
      <AppContainer>
        <div className={classes.content}>
          <NoSsr>
            <Box display="flex">
              <AppLink
                href={{
                  pathname: "/",
                }}
                display="flex"
              >
                <LogoImage className={classes.logo} />
              </AppLink>
            </Box>
            <div className={classes.navList}>
              {!isTabletDown && (
                <AppLink href="/" variant="titleSemi20">
                  {t("homepage")}
                </AppLink>
              )}
              <AppLink
                href={variantState?.footerNextLink?.href ?? "/"}
                variant="titleSemi20"
              >
                {variantState?.footerNextLink?.text}
              </AppLink>
            </div>
          </NoSsr>
        </div>
      </AppContainer>
    </section>
  );
};

export default PortalFooter;
