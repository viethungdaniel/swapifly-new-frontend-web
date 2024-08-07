import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDialogContent",
})((theme) => {
  return {
    root: {
      padding: theme.spacing(3, 3),
      ".MuiDialog-paperScrollBody .MuiDialogTitle-root+&": {
        paddingTop: theme.spacing(0),
      },
      ".MuiDialog-paperScrollPaper .MuiDialogTitle-root+&": {
        paddingTop: theme.spacing(3),
      },
      [theme.breakpoints.down("md")]: {
        padding: theme.spacing(3, 3),
      },
      [theme.breakpoints.down("tablet")]: {
        padding: theme.spacing(3, 3),
        ".MuiDialog-paperFullScreen &": {
          backgroundColor: theme.palette.common.lightestNeutral,
          padding: theme.spacing(3, 3),
        },
        ".MuiDialogTitle-root + &": {
          paddingTop: theme.spacing(3),
        },
      },
      [theme.breakpoints.down("sm")]: {
        ".MuiDialog-paperFullScreen &": {
          padding: theme.spacing(3, 2),
        },
      },
    },
  };
});

export default useStyles;
