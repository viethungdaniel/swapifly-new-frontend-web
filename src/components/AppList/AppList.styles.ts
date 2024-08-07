import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appList",
})((theme) => {
  return {
    padding: {
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
    },
    edgeTop: {
      marginTop: theme.spacing(-1.25),
    },
    edgeBottom: {
      marginBottom: theme.spacing(-1.25),
    },
    edgeStart: {
      marginLeft: theme.spacing(-3),
      [theme.breakpoints.down("sm")]: {
        marginLeft: theme.spacing(-2),
      },
    },
    edgeEnd: {
      marginRight: theme.spacing(-3),
      [theme.breakpoints.down("sm")]: {
        marginRight: theme.spacing(-2),
      },
    },
    edgeX: {
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(-3),
      [theme.breakpoints.down("sm")]: {
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
      },
    },
    edgeY: {
      marginTop: theme.spacing(-1.25),
      marginBottom: theme.spacing(-1.25),
    },
    edgeXY: {
      marginTop: theme.spacing(-1.25),
      marginBottom: theme.spacing(-1.25),
      marginLeft: theme.spacing(-3),
      marginRight: theme.spacing(-3),
      [theme.breakpoints.down("sm")]: {
        marginLeft: theme.spacing(-2),
        marginRight: theme.spacing(-2),
      },
    },
  };
});

export default useStyles;
