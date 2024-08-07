import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PortalFooter",
  uniqId: "ErvIEr",
})((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.common.lightNeutral,
    },
    content: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        alignItems: "center",
      },
    },
    logo: {
      height: 34,
      width: "auto",
      [theme.breakpoints.down("tablet")]: {
        height: 24,
      },
    },
    navList: {
      display: "flex",
      gap: 120,
    },
  };
});

export default useStyles;
