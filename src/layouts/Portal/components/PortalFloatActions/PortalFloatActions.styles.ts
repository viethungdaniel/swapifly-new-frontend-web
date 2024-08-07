import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PortalFloatActions",
})((theme) => {
  return {
    root: {
      position: "fixed",
      // bottom: `calc(60px + ${theme.spacing(3)})`,
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      zIndex: theme.zIndex.appBar,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(3.75),
      [theme.breakpoints.down("tablet")]: {
        bottom: `calc(80px + ${theme.spacing(3)})`,
        gap: theme.spacing(2.5),
      },
      [theme.breakpoints.down("sm")]: {
        right: theme.spacing(2),
        // bottom: `calc(80px + ${theme.spacing(2)})`,
        bottom: theme.spacing(2),
      },
    },
    scrollTopButton: {
      filter: "drop-shadow(0px 2px 4px rgba(27, 46, 94, 0.08))",
    },
  };
});

export default useStyles;
