import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SaleProductFormik",
  uniqId: "kM8jzD",
})((theme) => {
  return {
    paper: {
      backgroundColor: theme.palette.common.lighterNeutral,
      [theme.breakpoints.down("tablet")]: {
        backgroundColor: "transparent",
      },
    },
    paperContent: {
      [theme.breakpoints.down("tablet")]: {
        padding: 0,
      },
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
    },
  };
});

export default useStyles;
