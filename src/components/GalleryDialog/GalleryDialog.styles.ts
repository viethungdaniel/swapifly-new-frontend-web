import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "active" | "hidden" | "video">({
  name: "galleryDialog",
  uniqId: "2nyH0G",
})((theme, _, classes) => {
  return {
    dialogPaper: {
      backgroundColor: theme.palette.common.black,
    },
    dialogContent: {
      position: "relative",
      padding: 0,
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    mediaTitle: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      height: 80,
      color: theme.palette.common.white,
    },
    mediaTitlePrimary: {
      maxWidth: `calc(100% - 136px*2 - ${theme.spacing(3)})`,
      [theme.breakpoints.down("md")]: {
        maxWidth: `calc(100% - 64px*2 - ${theme.spacing(3)})`,
      },
    },
    mediaTitleSecondary: {
      maxWidth: `calc(100% - 136px*2 - ${theme.spacing(3)})`,
      [theme.breakpoints.down("md")]: {
        maxWidth: `calc(100% - 64px*2 - ${theme.spacing(3)})`,
      },
    },
    mediaTitleToolbar: {
      position: "absolute",
      top: "50%",
      transform: "translateY(-50%)",
      display: "flex",
      gap: theme.spacing(2),
    },
    mediaTitleToolbarEnd: {
      right: 0,
    },
    mediaTitleToolbarStart: {
      left: 0,
    },
    mediaContent: {
      position: "relative",
      flex: 1,
    },
    mediaSwiper: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      "& > .swiper": {
        height: "100%",
      },
    },
    mediaItem: {
      width: "100%",
    },

    photo: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    photoCropper: {
      width: "100%",
      minHeight: "100%",
      background: "transparent",
    },
    photoCropperOverlay: {
      color: "transparent",
    },
    photoToolbar: {
      position: "absolute",
      bottom: theme.spacing(3),
      left: "50%",
      transform: "translateX(-50%)",
      borderRadius: theme.shape.borderRadius / 2,
      overflow: "hidden",
      display: "flex",
      padding: theme.spacing(1),
      gap: theme.spacing(2),
      backgroundColor: alpha(theme.palette.common.darkNeutral, 0.3),
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
      transition: theme.transitions.create(["opacity"], {
        duration: 1000,
      }),
      [`&.${classes.active}`]: {
        opacity: 1,
        pointerEvents: "auto",
      },
      [theme.breakpoints.down("md")]: {
        borderRadius: 0,
        justifyContent: "space-around",
        bottom: theme.spacing(0),
        width: "100%",
      },
    },
    photoToolbarButton: {
      padding: theme.spacing(1),
      fontSize: 20,
      color: theme.palette.common.white,
      borderRadius: theme.shape.borderRadius / 2,
    },

    youtube: {
      width: "100%",
      height: "100%",
      borderWidth: 0,
    },

    video: {
      width: "100%",
      height: "100%",
      objectFit: "contain",
      "& video": {
        background: theme.palette.common.black,
      },
    },

    thumbnail: {
      height: 80,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    thumbnailSwiper: {
      position: "relative",
      zIndex: 2,
      // maskImage: `linear-gradient( to right, transparent, ${theme.palette.common.black} 3%, ${theme.palette.common.black} calc(100% - 3%), transparent), linear-gradient(${theme.palette.common.black}, ${theme.palette.common.black})`,
      // maskSize: "100% 100%, 0 100%",
      // maskPosition: "0 0, 100% 0",
      // maskRepeat: "no-repeat, no-repeat",
    },
    thumbnailItem: {
      width: "100%",
      height: 80 - 8 * 2,
      borderRadius: 4,
      overflow: "hidden",
      position: "relative",
      transition: theme.transitions.create(["opacity"]),
      opacity: 0.5,
      cursor: "pointer",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        zIndex: 1,
        width: "calc(100% - 4px)",
        height: "calc(100% - 4px)",
        border: `2px solid transparent`,
        borderRadius: 4,
        transition: theme.transitions.create(["border-color"]),
      },
      [`.swiper-slide-thumb-active &`]: {
        opacity: 1,
        "&:before": {
          borderColor: theme.palette.common.white,
        },
      },
      [`& .${classes.video}`]: {
        position: "absolute",
        top: 0,
        left: 0,
      },
    },

    navigationArrow: {
      position: "absolute",
      top: "50%",
      zIndex: 1,
      opacity: 1,
      [`&.${classes.hidden}`]: {
        opacity: 0,
        pointerEvents: "none",
      },
    },
    navigationArrowNext: {
      right: theme.spacing(3),
      translate: "0 -50%",
    },
    navigationArrowButton: {
      width: 40,
      height: 40,
      fontSize: 16,
      borderRadius: "50%",
      border: `1px solid ${theme.palette.common.lightNeutral}`,
      backgroundColor: theme.palette.common.white,
      scale: 1,
      transition: theme.transitions.create(["scale"]),
    },
    navigationArrowButtonDisabled: {
      scale: 0,
    },
    navigationArrowPrev: {
      left: theme.spacing(3),
      translate: "0 -50%",
    },
    active: {},
    hidden: {},
  };
});

export default useStyles;
