import _get from "lodash/get";
import { makeStyles } from "tss-react/mui";

const formHelperTextColorToKeyMap = {
  textPrimary: "text.primary",
  textSecondary: "text.secondary",
  primary: "primary.main",
  secondary: "secondary.main",
} as { [key: string]: string };

const useStyles = makeStyles<{ color?: string }>({
  name: "appFormHelperText",
})((theme, params) => {
  const color =
    _get(theme.palette, formHelperTextColorToKeyMap[params?.color!]) ||
    _get(theme.palette, params?.color || "") ||
    params.color;

  return {
    root: {
      ...theme.typography.captionReg12,
      color,
      margin: theme.spacing(0.5, 0, 0),
      paddingLeft: theme.spacing(0.75),
    },
  };
});

export default useStyles;
