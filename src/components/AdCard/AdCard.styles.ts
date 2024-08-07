import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "standard">({
  name: "AdCard",
  uniqId: "qaT1nO",
})((theme, _, classes) => {
  return {
    root: {
      width: 284,
      maxWidth: "100%",
      display: "flex",
      flexDirection: "column",
    },
    boxShadowCard: {
      boxShadow: "0px 8px 24px -4px rgba(27, 46, 94, 0.08)",
    },
    filled: {
      backgroundColor: theme.palette.common.lightestNeutral,
      borderRadius: theme.shape.borderRadius / 2,
      overflow: "clip",
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
    mediaShapeRectangle: {
      display: "flex",
      width: "100%",
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
      [`.${classes.standard} &`]: {
        borderRadius: theme.shape.borderRadius / 2,
      },
    },
    mediaShapeRectanglePhoto: {
      width: "100%",
      height: "auto",
      backgroundColor: theme.palette.common.white,
      [`.${classes.standard} &`]: {
        borderRadius: theme.shape.borderRadius / 2,
      },
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
    contentFooter: {
      display: "flex",
      gap: theme.spacing(1),
    },
    adDescription: {
      marginBottom: theme.spacing(0.5),
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    adTitle: {
      marginBottom: theme.spacing(0.5),
    },
    publisher: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
      overflow: "auto",
    },
    publisherAvatar: {
      width: 24,
      height: 24,
    },
    publisherTitle: {
      flex: 1,
    },
  };
});

export default useStyles;
