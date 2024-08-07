import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "generalActionBar",
  uniqId: "SSJpIU",
})((theme, _, classes) => {
  return {
    root: {
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
      backgroundColor: theme.palette.common.lighterNeutral,
      [theme.breakpoints.down("tablet")]: {
        paddingTop: theme.spacing(2.5),
        paddingBottom: theme.spacing(2.5),
      },
    },
    regionAndLanguage: {
      display: "flex",
      justifyContent: "flex-end",
      gap: theme.spacing(2.5),
    },
    regionAvatar: {
      width: 24 + 2,
      height: 24 + 2,
      fontSize: 16,
      cursor: "pointer",
      color: theme.palette.text.primary,
      backgroundColor: "transparent",
      border: `1px solid transparent`,
      [`.${classes.selected} &`]: {
        borderColor: theme.palette.common.blue,
      },
    },
    regionAvatarCheckedCircleIcon: {
      fontSize: 12,
      color: theme.palette.common.blue,
      transform: "scale(0)",
      transition: theme.transitions.create(["transform"]),
      [`.${classes.selected} &`]: {
        transform: "scale(1)",
      },
    },
    regionBadge: {
      pointerEvents: "none",
    },
    regionMenuList: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },

    appSelect: {
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.common.darkNeutral,
      },
    },

    selected: {},
  };
});

export default useStyles;
