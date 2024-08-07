import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "Main",
})((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.default,
      minHeight: "100dvh",
    },
    main: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      width: "100%",
    },
    mainBottomAppBarToolbar: {
      display: "none",
      [theme.breakpoints.down("tablet")]: {
        display: "initial",
      },
    },
  };
});

export default useStyles;
