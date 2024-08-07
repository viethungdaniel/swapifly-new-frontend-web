import { alpha, darken } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "appMenuItem",
  uniqId: "BuxwSj",
})((theme, _, classes) => {
  return {
    root: {
      fontFamily: theme.typography.bodyReg14.fontFamily,
      fontSize: theme.typography.bodyReg14.fontSize,
      fontWeight: theme.typography.bodyReg14.fontWeight,
      lineHeight: "20px",
      padding: theme.spacing(1.25, 3),
      minHeight: 50,
      [`&.${classes.selected}`]: {
        backgroundColor: theme.palette.common.lightNeutral,
        "&:hover": {
          backgroundColor: alpha(
            theme.palette.common.neutral,
            theme.palette.action.focusOpacity
          ),
        },
        "&.Mui-focused": {
          backgroundColor: darken(
            theme.palette.common.lightNeutral,
            theme.palette.action.hoverOpacity
          ),
        },
        "&.Mui-focusVisible": {
          backgroundColor: darken(
            theme.palette.common.lightNeutral,
            theme.palette.action.hoverOpacity
          ),
        },
      },
      "&.Mui-focused": {
        backgroundColor: alpha(
          theme.palette.common.neutral,
          theme.palette.action.focusOpacity
        ),
      },
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.common.neutral,
          theme.palette.action.focusOpacity
        ),
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1.25, 2),
      },
    },
    selected: {},
  };
});

export default useStyles;
