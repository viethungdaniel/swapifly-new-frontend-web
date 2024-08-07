import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDrawerActions",
})((theme) => {
  return {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(1.25),
      padding: theme.spacing(3.75, 3),
      position: "relative",
      backgroundColor: theme.palette.common.lightestNeutral,
      [theme.breakpoints.down("tablet")]: {
        padding: theme.spacing(2.5, 3),
        justifyContent: "center",
        height: 80,
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2.5, 2),
      },
    },
    stickyFooter: {
      position: "sticky",
      bottom: 0,
      zIndex: 1,
      [theme.breakpoints.down("tablet")]: {
        backgroundColor: theme.palette.common.white,
        boxShadow: "0px -11px 24px -4px rgba(27, 46, 94, 0.08)",
      },
    },
  };
});

export default useStyles;
