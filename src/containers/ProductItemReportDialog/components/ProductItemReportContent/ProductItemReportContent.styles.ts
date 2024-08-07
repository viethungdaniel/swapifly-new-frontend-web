import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "ProductItemReportContent",
  uniqId: "Lo7zB4",
})((theme) => {
  return {
    productItem: {
      backgroundColor: theme.palette.common.lighterNeutral,
      padding: theme.spacing(1.25),
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2.5),
      borderRadius: theme.shape.borderRadius,
      [theme.breakpoints.down("tablet")]: {
        borderRadius: 0,
        paddingLeft: theme.app.spacings.gutters,
        paddingRight: theme.app.spacings.gutters,
        marginLeft: -theme.app.spacings.gutters,
        marginRight: -theme.app.spacings.gutters,
      },
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.app.spacings.guttersSmall,
        paddingRight: theme.app.spacings.guttersSmall,
        marginLeft: -theme.app.spacings.guttersSmall,
        marginRight: -theme.app.spacings.guttersSmall,
      },
    },
    productItemPhoto: {
      position: "relative",
      width: 50,
      height: 50,
      borderRadius: theme.shape.borderRadius / 2,
      overflow: "clip",
    },
    productItemContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    menuButtonTabs: {
      [theme.breakpoints.down("tablet")]: {
        borderRadius: 0,
        paddingLeft: theme.app.spacings.gutters,
        paddingRight: theme.app.spacings.gutters,
        marginLeft: -theme.app.spacings.gutters,
        marginRight: -theme.app.spacings.gutters,
      },
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.app.spacings.guttersSmall,
        paddingRight: theme.app.spacings.guttersSmall,
        marginLeft: -theme.app.spacings.guttersSmall,
        marginRight: -theme.app.spacings.guttersSmall,
      },
    },
  };
});

export default useStyles;
