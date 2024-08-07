import _get from "lodash/get";

import { makeStyles } from "tss-react/mui";

const labelColorToKeyMap = {
  textPrimary: "text.primary",
  textSecondary: "text.secondary",
  primary: "primary.main",
  secondary: "secondary.main",
} as { [key: string]: string };

const useStyles = makeStyles<{ color?: string }, "focused" | "error">({
  name: "appInputLabel",
  uniqId: "yfTSky",
})((theme, params, classes) => {
  const color =
    _get(theme.palette, labelColorToKeyMap[params?.color!]) ||
    _get(theme.palette, params?.color || "") ||
    params.color;

  return {
    root: {
      ...theme.typography.bodyMed14,
      color,
      transform: "initial",
      paddingLeft: theme.spacing(0.75),
      [`&.${classes.focused}`]: {
        color,
      },
      [`&.${classes.error}`]: {
        color: theme.palette.error.main,
      },
    },
    asterisk: {
      color: theme.palette.error.main,
    },
    error: {},
    focused: {},
  };
});

export default useStyles;
