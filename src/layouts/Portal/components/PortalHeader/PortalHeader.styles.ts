import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PortalHeader",
  uniqId: "ErvIEr",
})((theme) => {
  return {
    root: {
      overflowX: "clip",
      backgroundColor: theme.palette.common.white,
    },
    logo: {
      height: 34,
      width: "auto",
      [theme.breakpoints.down("tablet")]: {
        height: 24,
      },
    },
    portalHeaderAppBarToolbar: {
      flexDirection: "column",
    },
    content: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      width: "100%",
    },
    divider: {
      width: "100%",
      height: 20,
      backgroundColor: theme.palette.primary.main,
    },
  };
});

export default useStyles;
