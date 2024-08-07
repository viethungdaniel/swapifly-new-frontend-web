import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "iconContainer" | "selected" | "focused">({
  name: "AppTreeItem",
  uniqId: "mRCEnO",
})((theme, _, classes) => {
  return {
    label: {
      paddingTop: theme.spacing(13 / 8),
      paddingBottom: theme.spacing(13 / 8),
    },
    content: {
      [`& .${classes.iconContainer}`]: {
        "& svg": {
          fontSize: 24,
        },
      },
      [`&.${classes.selected}`]: {
        backgroundColor: theme.palette.common.lightNeutral,
        "&:hover": {
          backgroundColor: theme.palette.common.lightNeutral,
        },
        [`&.${classes.focused}`]: {
          backgroundColor: theme.palette.common.lightNeutral,
        },
      },
    },
    iconContainer: {},
    selected: {},
    focused: {},
  };
});

export default useStyles;
