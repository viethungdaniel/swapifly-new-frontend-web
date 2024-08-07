import { makeStyles } from "tss-react/mui";

import { imageHelpers } from "@/utils/helpers";

const useStyles = makeStyles({
  name: "SectionAppIntroBanner",
})((theme) => {
  return {
    root: {
      // background: `url(${imageHelpers.optimizedImageLoader({
      //   src: "/images/pages/home/app-intro-background.jpg",
      // })}), url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 484' preserveAspectRatio='none' fill='none'%3E%3Cpath d='M0 0H1440L0 484V0Z' fill='%23${theme.palette.common.white.replace(
      //   "#",
      //   ""
      // )}' fill-opacity='0.2'/%3E%3C/svg%3E"), ${theme.palette.primary.main}`,
      background: `url(${imageHelpers.optimizedImageLoader({
        src: "/images/pages/home/app-intro-background.jpg",
      })}), ${theme.palette.primary.main}`,
      backgroundBlendMode: "multiply",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center bottom",
      backgroundSize: "cover, cover",
      minHeight: 484,
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1440 484' preserveAspectRatio='none' fill='none'%3E%3Cpath d='M0 0H1440L0 484V0Z' fill='%23${theme.palette.common.white.replace(
          "#",
          ""
        )}' fill-opacity='0.2'/%3E%3C/svg%3E")`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "100% 100%",
      },
    },
    main: {
      position: "relative",
      zIndex: 1,
      color: theme.palette.common.white,
    },
    thumbnail: {
      height: 395,
      width: "auto",
    },
    content: {
      marginLeft: "18%",
      [theme.breakpoints.down("lg")]: {
        marginLeft: "12%",
      },
      [theme.breakpoints.down("md")]: {
        marginLeft: "auto",
      },
    },
    appStoreButton: {
      borderRadius: 8,
    },
    appStoreSvg: {
      height: 50,
    },
    qrCode: {
      width: 50 * 2 + 16,
      paddingTop: "100%",
      position: "relative",
      backgroundColor: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius,
    },
    qrCodeCanvas: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
      width: `calc(100% - ${theme.spacing(3)}) !important`,
      height: `calc(100% - ${theme.spacing(3)}) !important`,
    },
  };
});

export default useStyles;
