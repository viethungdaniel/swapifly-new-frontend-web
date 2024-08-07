import { commonConstants } from "@/utils/constants";

import { AppBar, Box, NoSsr, useMediaQuery } from "@mui/material";
import AppContainer from "@/components/AppContainer";
import AppLink from "@/components/AppLink";
import LogoImage from "@/components/LogoImage";
import PortalHeaderAppBarToolbar from "@/layouts/Portal/components/PortalHeader/components/PortalHeaderAppBarToolbar";
import AppTypography from "@/components/AppTypography";
import LanguageMenuButton from "@/layouts/Portal/components/PortalHeader/components/LanguageMenuButton";
import LanguageDrawerIconButton from "@/layouts/Portal/components/PortalHeader/components/LanguageDrawerIconButton";

import { useContext } from "react";

import PortalContext from "@/layouts/Portal/Portal.context";

import useStyles from "./PortalHeader.styles";

const PortalHeader = () => {
  const { classes, theme } = useStyles();

  const isTabletDown = useMediaQuery(theme.breakpoints.down("tablet"));

  const { variantState } = useContext(PortalContext);

  return (
    <>
      <AppBar
        id={commonConstants.PORTAL_HEADER_ELE_ID}
        className={classes.root}
        elevation={0}
        color="default"
      >
        <PortalHeaderAppBarToolbar
          className={classes.portalHeaderAppBarToolbar}
          disableGutters
        >
          <AppContainer className={classes.content}>
            <AppLink
              href={{
                pathname: "/",
              }}
              display="flex"
            >
              <LogoImage className={classes.logo} />
            </AppLink>
            <NoSsr>
              {!isTabletDown && (
                <>
                  <AppTypography
                    ml={3.75}
                    variant="titleSemi20"
                    textTransform="capitalize"
                  >
                    {variantState?.headerTitle}
                  </AppTypography>
                  <Box flex={1} />
                  <LanguageMenuButton />
                </>
              )}
              {isTabletDown && (
                <>
                  <Box flex={1} />
                  <LanguageDrawerIconButton />
                </>
              )}
            </NoSsr>
          </AppContainer>
          <span className={classes.divider} />
        </PortalHeaderAppBarToolbar>
      </AppBar>
      <PortalHeaderAppBarToolbar />
    </>
  );
};

export default PortalHeader;
