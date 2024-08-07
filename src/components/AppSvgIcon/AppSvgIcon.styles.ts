import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

import type { AppSvgIconProps } from "./AppSvgIcon";

type StylesParams = {
  color?: AppSvgIconProps["color"];
};

const useStyles = makeStyles<StylesParams>({
  name: "AppSvgIcon",
  uniqId: "g6cnKd",
})((theme, params) => {
  const keyToColorMap = {
    primary: theme.palette.primary.main,
  } as { [key: string]: string };

  const color: string =
    keyToColorMap[params?.color!] ||
    _get(theme.palette, params?.color!) ||
    params?.color;

  return {
    root: {
      fill: "currentColor",
      transition: `fill ${theme.transitions.duration.shorter}ms ${theme.transitions.easing.easeInOut} 0ms`,
      color,
    },
    fontSizeSmall: {
      fontSize: 20,
    },
  };
});

export default useStyles;
