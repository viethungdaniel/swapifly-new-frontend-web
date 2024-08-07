import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

import type { ButtonTabsProps } from "./ButtonTabs";

type StylesParams = Pick<ButtonTabsProps, "indicatorColor" | "textColor">;

const useStyles = makeStyles<StylesParams, "indicator">({
  name: "ButtonTabs",
  uniqId: "qBBdZk",
})((theme, params, classes) => {
  const keyToColorMap = {
    primary: theme.palette.primary.main,
    textPrimary: theme.palette.text.primary,
    inherit: "inherit",
  };

  const indicatorColor =
    keyToColorMap[params?.indicatorColor! as keyof typeof keyToColorMap] ||
    _get(theme.palette, params.indicatorColor!) ||
    (params.indicatorColor ?? theme.palette.primary.main);
  const textColor =
    keyToColorMap[params?.textColor! as keyof typeof keyToColorMap] ||
    _get(theme.palette, params.textColor!) ||
    (params.textColor ?? theme.palette.getContrastText(indicatorColor));

  return {
    root: {
      minHeight: 50,
      position: "relative",
      backgroundColor: theme.palette.common.lighterNeutral,
      padding: theme.spacing(1.25),
      borderRadius: theme.shape.borderRadius,
      "& .MuiTab-root.Mui-selected": {
        color: textColor,
      },
    },
    indicator: {
      backgroundColor: indicatorColor,
      height: "100%",
      borderRadius: theme.shape.borderRadius,
      zIndex: 0,
      transition: theme.transitions.create(["width", "left"], {
        duration: theme.transitions.duration.standard,
      }),
    },
    labelNoWrap: {
      "& .ButtonTab-label": {
        maxWidth: "100%",
        whiteSpace: "nowrap",
        overflow: "hidden",
        textOverflow: "ellipsis",
      },
    },
    vertical: {
      [`& .${classes.indicator}`]: {
        width: 1,
        translate: "-100% 0",
      },
    },
    verticalDivider: {
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        right: 0,
        height: "100%",
        width: 1,
        translate: "-100% 0",
        backgroundColor: theme.palette.common.lightNeutral,
      },
    },
    horizontalDivider: {
      "&:before": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        backgroundColor: theme.palette.common.lightNeutral,
      },
    },
    scrollButtons: {
      position: "absolute",
      zIndex: 1,
      [`&.MuiTabScrollButton-horizontal`]: {
        top: 0,
        right: 0,
        height: "100%",
        "&:first-of-type": {
          left: 0,
        },
      },
      [`&.MuiTabScrollButton-vertical`]: {
        bottom: 0,
        left: 0,
        width: "100%",
        "&:first-of-type": {
          top: 0,
        },
      },
    },
  };
});

export default useStyles;
