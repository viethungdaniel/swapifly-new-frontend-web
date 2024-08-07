import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "MainBottomAppBarToolbar",
})((theme) => {
  return {
    root: {
      width: "100%",
      position: "relative",
      height: 80,
    },
    paddingY: {
      paddingTop: theme.spacing(3),
      paddingBottom: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(2),
        paddingBottom: theme.spacing(2),
      },
    },
    autoHeight: {
      minHeight: 80,
      height: "auto",
    },
  };
});

export default useStyles;
