import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "loadingContent">({
  name: "loadingOverlay",
  uniqId: "15NHSu",
})((theme, _, classes) => {
  return {
    root: {
      position: "relative",
    },
    loading: {
      minHeight: 240,
    },
    loadingContentHidden: {
      [`& > *:not(.${classes.loadingContent})`]: {
        display: "none !important",
      },
    },
    loadingContent: {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 10,
      width: "100%",
      height: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(1.5),
      color: theme.palette.primary.main,
    },
  };
});

export default useStyles;
