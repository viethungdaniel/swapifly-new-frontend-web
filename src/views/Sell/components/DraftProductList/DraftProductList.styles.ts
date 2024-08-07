import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "DraftProductList",
})((theme) => {
  return {
    draftProductItem: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.25 / 2),
    },
    draftProductItemThumbnail: {
      position: "relative",
      width: "100%",
      paddingTop: "100%",
      borderRadius: theme.shape.borderRadius / 2,
      overflow: "clip",
    },
    draftProductItemTitle: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      padding: theme.spacing(0, 1.25 / 2),
    },
    draftProductItemRemoveButton: {
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 1,
    },
    draftProductItemTag: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      backgroundColor: theme.palette.common.darkNeutral,
      color: theme.palette.common.white,
      padding: theme.spacing(0, 1.25),
    },
  };
});

export default useStyles;
