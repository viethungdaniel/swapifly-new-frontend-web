import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "title">({
  name: "appDialogTitle",
  uniqId: "UvmDdi",
})((theme, _, classes) => {
  return {
    root: {
      padding: theme.spacing(2, 3),
      display: "flex",
      textAlign: "center",
      position: "relative",
      minHeight: 80,
      alignItems: "center",
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(3),
      },
      [theme.breakpoints.down("tablet")]: {
        ".MuiDialog-paperFullScreen &": {
          backgroundColor: theme.palette.common.lightestNeutral,
        },
      },
      [theme.breakpoints.down("sm")]: {
        ".MuiDialog-paperFullScreen &": {
          padding: theme.spacing(2, 2),
        },
      },
      ".MuiDialog-paperScrollPaper &": {
        borderBottom: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.common.white,
      },
      ".MuiDialog-paperScrollPaper.MuiDialog-paperFullScreen &": {
        borderBottomWidth: 0,
      },
    },
    title: {
      flex: 1,
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
      "&:empty:before": {
        content: "'\\00a0'",
      },
    },
    startActions: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
    endActions: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
    alignLeft: {
      [`& .${classes.title}`]: {
        textAlign: "left",
      },
    },
    alignCenter: {
      [`& .${classes.title}`]: {
        textAlign: "center",
      },
    },
    mobileAlignLeft: {
      [theme.breakpoints.down("tablet")]: {
        [`& .${classes.title}`]: {
          textAlign: "left",
        },
      },
    },
    mobileAlignCenter: {
      [theme.breakpoints.down("tablet")]: {
        [`& .${classes.title}`]: {
          textAlign: "center",
        },
      },
    },
  };
});

export default useStyles;
