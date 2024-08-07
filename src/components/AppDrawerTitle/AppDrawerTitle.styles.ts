import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDrawerTitle",
})((theme) => {
  return {
    root: {
      display: "flex",
      alignItems: "center",
      padding: theme.spacing(2, 3),
      position: "relative",
      height: 100,
      minHeight: 100,
      backgroundColor: theme.palette.common.white,
      [theme.breakpoints.down("tablet")]: {
        padding: theme.spacing(2, 3),
        justifyContent: "center",
        height: 80,
        minHeight: 80,
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2, 2),
      },
    },
    stickyHeader: {
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
  };
});

export default useStyles;
