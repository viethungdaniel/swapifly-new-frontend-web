import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SalesForm",
})((theme) => {
  return {
    paper: {
      backgroundColor: theme.palette.common.lighterNeutral,
      height: "100%",
    },
    paperContent: {
      height: "100%",
    },
    photo: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    photoFileUpload: {
      flex: 1,
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    fileUploadOutlinedUpload: {
      flex: 1,
    },
    submitBottomAppBar: {
      backgroundColor: theme.palette.common.white,
      top: "auto",
      bottom: 0,
      zIndex: theme.zIndex.appBar + 10,
      boxShadow: theme.app.shadows.bottomAppBar,
    },
    youtubePreview: {
      marginTop: theme.spacing(2.5),
      backgroundColor: theme.palette.common.lightNeutral,
      borderRadius: theme.shape.borderRadius,
      display: "flex",
      justifyContent: "space-between",
      gap: theme.spacing(2.5),
      [theme.breakpoints.down("tablet")]: {
        gap: theme.spacing(1.25),
        flexDirection: "column",
        justifyContent: "flex-start",
      },
      [theme.breakpoints.down("sm")]: {
        gap: theme.app.spacings.guttersSmall,
      },
    },
    youtubePreviewPlayerWrapper: {
      border: `1px solid ${theme.palette.common.darkNeutral}`,
      borderRadius: theme.shape.borderRadius / 2,
      position: "relative",
      flex: 1,
      paddingTop: "calc(100%*206/362)",
      overflow: "clip",
      "& > *": {
        position: "absolute",
        top: 0,
        left: 0,
      },
      "& iframe": {
        // width: "100% !important",
        // height: "100% !important",
      },
    },
  };
});

export default useStyles;
