import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "TabPanelProductList",
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
    searchInput: {
      width: 320,
      maxWidth: "100%",
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    },
    actions: {
      marginTop: theme.spacing(3.75),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
});

export default useStyles;
