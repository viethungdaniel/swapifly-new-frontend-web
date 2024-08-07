import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";
import { lighten } from "@mui/material/styles";

type StylesParams = {
  color?: string;
};

const useStyles = makeStyles<StylesParams>({
  name: "LoadingLinearProgress",
  uniqId: "Jf1erL",
})((theme, params) => {
  const keyToColorMap = {
    default: theme.palette.primary.main,
    primary: theme.palette.primary.main,
    error: theme.palette.error.main,
  } as { [key: string]: string };

  const color: string =
    keyToColorMap[params?.color!] ||
    _get(theme.palette, params?.color!) ||
    params?.color ||
    keyToColorMap.default;

  return {
    root: {
      backgroundColor: lighten(color, 5 / 10),
    },
    hidden: {
      display: "none",
    },
    bar1Determinate: {
      backgroundColor: color,
    },
  };
});

export default useStyles;
