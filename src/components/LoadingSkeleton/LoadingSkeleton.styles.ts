import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "hidden">({
  name: "loadingSkeleton",
  uniqId: "sXUfBf",
})((theme, _, classes) => {
  return {
    root: {},
    banner: {
      position: "relative",
      width: "100%",
      paddingTop: "calc(100%*395/1920)",
      [theme.breakpoints.down("tablet")]: {
        paddingTop: "calc(100%*163/390)",
      },
    },
    bannerSkeleton: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    content: {
      [`.${classes.hidden} &`]: {
        display: "none",
      },
    },
    hidden: {},
  };
});

export default useStyles;
