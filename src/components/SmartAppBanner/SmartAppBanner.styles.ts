import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SmartAppBanner",
})((theme) => {
  return {
    smartAppBanner: {
      color: theme.palette.common.white,
      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 85' preserveAspectRatio='none' fill='%23${theme.palette.primary.main.replace(
        "#",
        ""
      )}'%3E%3Crect x='390' y='85' width='390' height='85' transform='rotate(-180 390 85)' /%3E%3Cpath d='M390 85L-1.43051e-05 85L390 -2.75671e-07V85Z' fill='white' fill-opacity='0.2'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    },
    smartAppBannerIconImg: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1),
    },
    content: {
      flex: 1,
      marginRight: theme.spacing(1),
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    contentText: {
      flex: 1,
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
  };
});

export default useStyles;
