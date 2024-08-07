import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<
  void,
  "standard" | "hightLighted" | "mediaPhoto" | "hasVideo"
>({
  name: "productCard",
  uniqId: "nfpXv7",
})((theme, _, classes) => {
  return {
    root: {
      width: 284,
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
      "&:hover": {
        [`& .${classes.mediaPhoto}`]: {
          transform: `scale(${1 + 1 / 5})`,
        },
      },
    },
    boxShadowCard: {
      boxShadow: "0px 8px 24px -4px rgba(27, 46, 94, 0.08)",
    },
    filled: {
      backgroundColor: theme.palette.common.lightestNeutral,
      borderRadius: theme.shape.borderRadius / 2,
      overflow: "hidden",
    },
    standard: {},
    fullWidth: {
      width: "100%",
    },
    fullHeight: {
      height: "100%",
    },
    media: {
      position: "relative",
      width: "100%",
      paddingTop: "100%",
      overflow: "hidden",
    },
    mediaPhoto: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "contain",
      objectPosition: "center",
      backgroundColor: theme.palette.common.white,
      transform: "scale(1)",
      transition: theme.transitions.create(["transform"], {
        duration: theme.transitions.duration.standard,
      }),
      [`.${classes.standard} &`]: {
        borderRadius: theme.shape.borderRadius / 2,
      },
    },
    mediaYoutube: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      overflow: "clip",
      "& > *": {
        position: "absolute",
        top: 0,
        left: 0,
        pointerEvents: "none",
      },
    },
    mediaPlacementLeftTop: {
      position: "absolute",
      top: 0,
      left: 0,
      padding: theme.spacing(2),
      maxWidth: "calc(100% - 32px)",
    },
    mediaPlacementLeftBottom: {
      position: "absolute",
      bottom: 0,
      left: 0,
      maxWidth: "100%",
      [`.${classes.hasVideo} &`]: {
        maxWidth: "calc(100% - 52px)",
      },
    },
    mediaPlacementRightTop: {
      position: "absolute",
      top: 0,
      right: 0,
      padding: theme.spacing(2),
    },
    mediaPlacementRightBottom: {
      position: "absolute",
      bottom: 0,
      right: 0,
      display: "flex",
      padding: theme.spacing(2),
    },
    playIcon: {
      fontSize: 32,
      color: theme.palette.common.neutral,
    },
    mediaTagItemBottom: {
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
    iconButton: {
      fontSize: 28,
      color: theme.palette.text.primary,
    },
    bookmarkOutlinedIconButton: {
      [`&.${classes.hightLighted}`]: {
        color: theme.palette.warning.main,
        "& svg path": {
          stroke: `${theme.palette.text.primary} !important`,
          fill: alpha(theme.palette.warning.main, 0.8),
        },
      },
    },
    heartOutlinedIconButton: {
      "& svg path": {
        fill: theme.palette.common.lighterNeutral,
      },
      [`&.${classes.hightLighted}`]: {
        color: theme.palette.primary.main,
        "& svg path": {
          stroke: `${theme.palette.text.primary} !important`,
          fill: theme.palette.primary.main,
        },
      },
    },
    mediaTagList: {
      display: "flex",
      gap: theme.spacing(1.25 / 2),
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      padding: theme.spacing(2),
      [`.${classes.standard} &`]: {
        padding: theme.spacing(2, 0),
      },
    },
    contentActions: {
      display: "flex",
      gap: theme.spacing(1),
    },
    productName: {
      marginBottom: theme.spacing(0.5),
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    productPrice: {
      marginBottom: theme.spacing(0.5),
    },
    user: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
      overflow: "auto",
    },
    userAvatar: {
      width: 24,
      height: 24,
    },
    userName: {
      flex: 1,
    },
    ownerActions: {
      position: "relative",
      display: "flex",
    },
    ownerActionsDivider: {
      position: "absolute",
      top: "50%",
      left: "50%",
      translate: "-50% -50%",
      height: `calc(100% - ${theme.spacing(2)})`,
      borderColor: theme.palette.common.darkNeutral,
      pointerEvents: "none",
    },
    reviewResultsButton: {
      borderRadius: theme.shape.borderRadius / 2,
      borderTopRightRadius: 0,
      borderTopLeftRadius: 0,
      borderBottomLeftRadius: 0,
    },
    purchaseVisitsButton: {
      borderRadius: theme.shape.borderRadius / 2,
      borderTopRightRadius: 0,
      borderBottomRightRadius: 0,
      borderTopLeftRadius: 0,
    },
    hightLighted: {},
    hasVideo: {},
  };
});

export default useStyles;
