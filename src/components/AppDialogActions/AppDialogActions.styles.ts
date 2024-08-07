import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDialogActions",
})((theme) => {
  return {
    root: {
      display: "flex",
      gap: theme.spacing(2),
      justifyContent: "center",
      padding: theme.spacing(3, 3),
      minHeight: 80,
      "> .MuiButton-root": {
        marginLeft: 0,
        minWidth: 100,
      },
      ".MuiDialog-paperScrollPaper &": {
        borderTop: `1px solid ${theme.palette.divider}`,
        backgroundColor: theme.palette.common.white,
      },
      ".MuiDialog-paperScrollBody .MuiDialogContent-root + &": {
        paddingTop: 0,
      },
      ".MuiDialog-paperScrollPaper.MuiDialog-paperFullScreen &": {
        borderTopWidth: 0,
        boxShadow: "0px -11px 24px -4px rgba(27, 46, 94, 0.08)",
      },
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(3, 3),
        ".MuiDialog-paperFullScreen &": {
          padding: theme.spacing(3),
        },
        ".MuiDialog-paperScrollBody .MuiDialogContent-root + &": {
          paddingTop: 0,
        },
      },
      [theme.breakpoints.down("tablet")]: {
        justifyContent: "center",
        alignItems: "center",
        ".MuiDialog-paperScrollPaper &": {
          padding: theme.spacing(0, 3),
          height: 80,
        },
        ".MuiDialog-paperFullScreen &": {
          padding: theme.spacing(0, 3),
          backgroundColor: theme.palette.common.lightestNeutral,
        },
      },
      [theme.breakpoints.down("sm")]: {
        ".MuiDialog-paperFullScreen &": {
          padding: theme.spacing(0, 2),
        },
      },
    },
  };
});

export default useStyles;
