import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "brandList",
})((theme) => {
  return {
    root: {
      overflowX: "clip",
    },
    brandItem: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.25),
    },
    brandItemLoading: {
      position: "relative",
      width: "100%",
      paddingTop: "100%",
    },
    brandItemLoadingSkeleton: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    brandItemLogo: {
      position: "relative",
      width: "100%",
      paddingTop: "100%",
      backgroundColor: theme.palette.common.lighterNeutral,
      borderRadius: "50%",
      overflow: "hidden",
    },
    swiperNavigationArrow: {
      top: "calc(50% - 34px/2)",
    },
  };
});

export default useStyles;
