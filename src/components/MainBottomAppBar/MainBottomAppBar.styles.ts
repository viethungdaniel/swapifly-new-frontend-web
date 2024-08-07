import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "mainBottomAppBar",
  uniqId: "OTLBjz",
})((theme, _, classes) => {
  return {
    menuList: {
      display: "flex",
      justifyContent: "space-around",
    },
    menuItem: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      gap: theme.spacing(0.5),
      color: theme.palette.common.neutral,
      transition: theme.transitions.create(["color"]),
      [`&.${classes.selected}`]: {
        color: theme.palette.primary.main,
      },
    },
    menuItemAvatar: {
      width: 23,
      height: 23,
      backgroundColor: theme.palette.common.neutral,
      border: `1px solid ${theme.palette.common.neutral}`,
      color: theme.palette.common.neutral,
      transition: theme.transitions.create([
        "background-color",
        "border-color",
      ]),
      [`.${classes.selected} &`]: {
        color: theme.palette.primary.main,
        borderColor: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main,
      },
    },
    menuItemIcon: {
      fontSize: 24,
    },
    selected: {},
  };
});

export default useStyles;
