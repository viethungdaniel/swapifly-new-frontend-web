import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "TabPanelDescription",
})((theme) => {
  return {
    title: {
      flex: 1,
      [theme.breakpoints.down("tablet")]: {
        display: "none",
      },
    },
    titleDivider: {
      [theme.breakpoints.down("tablet")]: {
        display: "none",
      },
    },
    content: {
      display: "flex",
      flexDirection: "column",
      paddingTop: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        paddingTop: 0,
      },
    },
  };
});

export default useStyles;
