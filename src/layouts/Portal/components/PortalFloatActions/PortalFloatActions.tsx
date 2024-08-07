import { Portal, Zoom, useScrollTrigger } from "@mui/material";
import AppIconButton from "@/components/AppIconButton";
import AppSvgIcon from "@/components/AppSvgIcon";

import ArrowTopScrollIcon from "@@/public/images/icons/arrow-top-scroll.svg";

import useStyles from "./PortalFloatActions.styles";

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

const PortalFloatActions = () => {
  const { classes } = useStyles();

  return (
    <Portal>
      <div className={classes.root}>
        <ScrollTopButton />
      </div>
    </Portal>
  );
};

export default PortalFloatActions;
