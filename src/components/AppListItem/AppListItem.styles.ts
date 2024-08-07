import { alpha, darken } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "appListItem",
  uniqId: "qWpSuI",
})((theme, _, classes) => {
  return {
    root: {
      minHeight: 50,
      [`&.${classes.selected}`]: {
        backgroundColor: theme.palette.common.lightNeutral,
        "&.Mui-focused": {
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
    },
    padding: {
      padding: theme.spacing(1.25, 3),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(1.25, 2),
      },
    },
    selected: {},
  };
});

export default useStyles;
