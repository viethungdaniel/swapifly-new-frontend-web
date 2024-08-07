import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "checked">({
  name: "productPhotoList",
  uniqId: "5LbAsJ",
})((theme, _, classes) => {
  return {
    root: {
      position: "relative",
      borderRadius: theme.shape.borderRadius,
      overflow: "clip",
      [theme.breakpoints.down("tablet")]: {
        borderRadius: 0,
      },
    },
    gallery: {
      position: "relative",
      zIndex: 2,
    },
    gallerySwiperNavigationArrowPrev: {
      left: theme.spacing(2.5),
      translate: "0% -50%",
      width: "40px !important",
      height: "40px !important",
      fontSize: "16px !important",
    },
    gallerySwiperNavigationArrowNext: {
      right: theme.spacing(2.5),
      translate: "0% -50%",
      width: "40px !important",
      height: "40px !important",
      fontSize: "16px !important",
    },
    galleryBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "clip",
      "&:after": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: `${alpha(theme.palette.common.darkNeutral, 0.6)}`,
        zIndex: 1,
      },
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        background: `var(--background-image)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
      },
    },
    galleryBackgroundBlur: {
      backdropFilter: "blur(30px)",
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 2,
    },
    galleryItem: {
      position: "relative",
      width: "100%",
      // paddingTop: "calc(100%*360/400)",
      paddingTop: "100%",
      cursor: "pointer",
      // [theme.breakpoints.down("tablet")]: {
      //   paddingTop: "calc(100%*288/390)",
      // },
    },
    galleryItemPhoto: {
      objectFit: "contain",
      objectPosition: "center",
    },
    galleryItemVideo: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    galleryItemYoutubeVideoBackground: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1,
    },
    galleryItemPlayIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
      transform: "translate(-50%,-50%)",
    },
    actions: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2.5),
    },
    bookmarkIcon: {
      [`&.${classes.checked}`]: {
        "& path": {
          stroke: `${theme.palette.text.primary} !important`,
          fill: alpha(theme.palette.warning.main, 0.8),
        },
      },
    },
    likeIcon: {
      "& path": {
        fill: theme.palette.common.lighterNeutral,
      },
      [`&.${classes.checked}`]: {
        "& path": {
          stroke: `${theme.palette.text.primary} !important`,
          fill: theme.palette.primary.main,
        },
      },
    },
    checked: {},
  };
});

export default useStyles;
