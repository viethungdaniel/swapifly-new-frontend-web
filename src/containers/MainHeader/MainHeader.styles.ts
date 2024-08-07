import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "mainHeader",
  uniqId: "fAxhpl1",
})((theme) => {
  return {
    mainAppBar: {
      overflowX: "clip",
      backgroundColor: theme.palette.common.white,
    },
    menuAppBar: {
      backgroundColor: theme.palette.primary.main,
    },
    mainHeaderAppToolbar: {
      gap: theme.spacing(3.75),
      [theme.breakpoints.down("tablet")]: {
        gap: theme.spacing(2.5),
      },
    },
    mainHeaderAppToolbarFullWidth: {
      flex: 1,
      display: "flex",
    },
    mainSearch: {
      flexBasis: 474,
    },
    mainHeaderAppToolbarActions: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(3.75),
    },
    logo: {
      height: 34,
      width: "auto",
      [theme.breakpoints.down("tablet")]: {
        height: 24,
      },
    },
  };
});

export default useStyles;
