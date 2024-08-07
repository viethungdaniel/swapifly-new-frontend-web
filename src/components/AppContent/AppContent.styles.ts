import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appContent",
})((theme) => {
  return {
    root: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      [theme.breakpoints.down("md")]: {
        paddingTop: theme.spacing(4),
        paddingBottom: theme.spacing(4),
      },
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.spacing(3),
        paddingBottom: theme.spacing(3),
      },
    },
  };
});

export default useStyles;
