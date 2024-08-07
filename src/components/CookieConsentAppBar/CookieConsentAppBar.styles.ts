import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "FloatCookieConsent",
})((theme) => {
  return {
    root: {
      top: "auto",
      bottom: 0,
      left: 0,
      backgroundColor: theme.palette.common.darkNeutral,
      color: theme.palette.common.white,
      zIndex: theme.zIndex.appBar + 50,
    },
    toolbar: {
      paddingTop: theme.spacing(2),
      paddingBottom: theme.spacing(2),
      [theme.breakpoints.up("xs")]: {
        minHeight: 80,
      },
      [theme.breakpoints.up("sm")]: {
        minHeight: 80,
      },
      [theme.breakpoints.up("tablet")]: {
        minHeight: 60 + 16,
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column",
        alignItems: "flex-end",
        gap: 4,
      },
    },
  };
});

export default useStyles;
