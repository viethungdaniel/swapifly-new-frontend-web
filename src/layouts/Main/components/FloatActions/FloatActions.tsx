import { commonConstants } from "@/utils/constants";

import {
  Box,
  Portal,
  Zoom,
  useEventCallback,
  useScrollTrigger,
} from "@mui/material";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";
import AppLink from "@/components/AppLink";

import ArrowTopScrollIcon from "@@/public/images/icons/arrow-top-scroll.svg";
import SellFabSvg from "@@/public/images/svgs/sell-fab.svg";

import { useState } from "react";
import { useAuthUser, useIsomorphicLayoutEffect } from "@/hooks";

import useStyles from "./FloatActions.styles";

type FloatActionsProps = { disabledSellIconButton?: boolean };

const ScrollTopButton = () => {
  const { classes, theme } = useStyles();

  const transitionDuration = {
    enter: theme.transitions.duration.enteringScreen,
    exit: theme.transitions.duration.leavingScreen,
  };

  const showScrollButton = useScrollTrigger({
    disableHysteresis: true,
    threshold: 164,
  });

  const handleScrollTopButtonClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <Zoom
      in={showScrollButton}
      timeout={transitionDuration}
      style={{
        transitionDelay: `${showScrollButton ? transitionDuration.exit : 0}ms`,
      }}
    >
      <AppIconButton
        variant="contained"
        color="common.white"
        borderRadius="circular"
        className={classes.scrollTopButton}
        onClick={handleScrollTopButtonClick}
      >
        <AppSvgIcon component={ArrowTopScrollIcon} fontSize="inherit" />
      </AppIconButton>
    </Zoom>
  );
};

const FloatActions = (props: FloatActionsProps) => {
  const { disabledSellIconButton } = props;

  const [mainBottomAppBarToolbarSize, setMainBottomAppBarToolbarSize] =
    useState(0);

  const { handleAuthNavigationPush } = useAuthUser();

  const { classes, theme, cx, css } = useStyles();

  const updateMainBottomAppBarToolbarSize = useEventCallback(() => {
    const mainBottomAppBarToolbarAnchors = document.querySelectorAll(
      `.${commonConstants.MAIN_BOTTOM_APP_BAR_TOOLBAR_ELE_CLASS}`
    );
    if (mainBottomAppBarToolbarAnchors.length > 0) {
      let newSize = 0;
      mainBottomAppBarToolbarAnchors.forEach((toolbarEl) => {
        newSize =
          toolbarEl.clientHeight > newSize ? toolbarEl.clientHeight : newSize;
      });
      setMainBottomAppBarToolbarSize(newSize);
    } else setMainBottomAppBarToolbarSize(0);
  });

  useIsomorphicLayoutEffect(() => {
    if (typeof window === "undefined") return;
    const observer = new MutationObserver(() => {
      updateMainBottomAppBarToolbarSize();
    });

    observer.observe(document, {
      subtree: true,
      attributes: true,
    });
    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <Portal>
      <Box
        className={cx(
          classes.root,
          css({
            [theme.breakpoints.down("tablet")]: {
              bottom: `calc(80px + ${theme.spacing(3)} + ${
                !!mainBottomAppBarToolbarSize
                  ? Math.abs(mainBottomAppBarToolbarSize - 80)
                  : 0
              }px)`,
            },
            [theme.breakpoints.down("sm")]: {
              bottom: `calc(80px + ${theme.spacing(2)} + ${
                !!mainBottomAppBarToolbarSize
                  ? Math.abs(mainBottomAppBarToolbarSize - 80)
                  : 0
              }px)`,
            },
          })
        )}
      >
        {!disabledSellIconButton && (
          <AppLink
            href="/sell"
            className={classes.sellButton}
            onClick={handleAuthNavigationPush("/sell")}
          >
            <SellFabSvg className={classes.sellButtonSvg} />
          </AppLink>
        )}
        <ScrollTopButton />
      </Box>
    </Portal>
  );
};

export default FloatActions;
