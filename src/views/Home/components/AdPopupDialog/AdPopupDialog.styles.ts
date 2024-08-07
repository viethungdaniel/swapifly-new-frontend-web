import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AdPopupDialog",
})((theme) => {
  return {
    root: {
      color: theme.palette.common.white,
    },
    dialogPaper: {
      margin: theme.spacing(4),
      overflow: "clip",
      flexDirection: "row",
      justifyContent: "center",
      flexWrap: "wrap",
    },
    adToolbarTop: {
      width: "100%",
      display: "flex",
      justifyContent: "flex-end",
      marginBottom: theme.spacing(2.5),
    },
    adToolbarBottom: {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(2.5),
    },
    adContent: {
      display: "flex",
      flexDirection: "column",
      overflow: "clip",
      borderRadius: theme.shape.borderRadius / 3,
    },
    adTag: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
      textAlign: "center",
      height: 30,
      position: "relative",
      "& span": {
        position: "absolute",
        top: "50%",
        left: "50%",
        translate: "-50% -50%",
        maxWidth: `calc(100% - ${theme.spacing(2)})`,
      },
    },
    learnMore: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    adMedia: {
      display: "flex",
      overflow: "clip",
    },
    adMediaImage: {
      width: "auto",
      maxWidth: "100%",
      height: "auto",
      maxHeight: `calc(100dvh - ${theme.spacing(
        4 * 2
      )} - 30px - 30px - ${theme.spacing(2.5 * 2)} - 50px)`,
      objectFit: "contain",
    },
    adMediaVideo: {
      width: "auto",
      maxWidth: "100%",
      height: "auto",
      maxHeight: `calc(100dvh - ${theme.spacing(
        4 * 2
      )} - 30px - 30px - ${theme.spacing(2.5 * 2)} - 50px)`,
      objectFit: "contain",
    },
  };
});

export default useStyles;
