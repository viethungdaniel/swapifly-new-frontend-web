import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

import type { CustomRatingProps } from "./AppRating";

type StylesParams = Pick<CustomRatingProps, "color">;

const useStyles = makeStyles<StylesParams>({
  name: "AppRating",
  uniqId: "eRpai0",
})((theme, params) => {
  const keyToColorMap: { [key: string]: string } = {
    default: theme.palette.common.starYellow,
    primary: theme.palette.primary.main,
    error: theme.palette.error.main,
  };

  const color: string =
    keyToColorMap[params?.color!] ||
    _get(theme.palette, params?.color!) ||
    params?.color! ||
    theme.palette.common.starYellow;

  return {
    sizeMedium: {
      fontSize: 24,
    },
    sizeSmall: {
      fontSize: 20,
    },
    iconFilled: {
      color,
    },
  };
});

export default useStyles;
