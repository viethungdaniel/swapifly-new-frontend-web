import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "AppPagination",
  uniqId: "LRijS3",
})((theme, _, classes) => {
  return {
    paginationItem: {
      fontSize: theme.typography.bodyReg14.fontSize,
      fontWeight: theme.typography.bodyReg14.fontWeight,
      fontFamily: theme.typography.bodyReg14.fontFamily,
      lineHeight: theme.typography.bodyReg14.lineHeight,
      [`&.${classes.selected}`]: {
        backgroundColor: "transparent",
        color: theme.palette.primary.main,
        "&:hover": {
          backgroundColor: alpha(
            theme.palette.primary.main,
            theme.palette.contrastThreshold / 10
          ),
          color: theme.palette.primary.main,
        },
      },
    },
    selected: {},
  };
});

export default useStyles;
