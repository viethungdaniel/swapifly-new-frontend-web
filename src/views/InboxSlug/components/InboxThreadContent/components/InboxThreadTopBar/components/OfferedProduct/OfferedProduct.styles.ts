import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "OfferedProduct",
})((theme) => {
  return {
    root: {
      minHeight: "auto",
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
      borderBottomWidth: 0,
      backgroundColor: theme.palette.common.lighterNeutral,
    },
    productItem: {
      display: "flex",
      gap: theme.spacing(2.5),
    },
    productItemSoldTag: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      textAlign: "center",
      color: theme.palette.common.white,
      backgroundColor: theme.palette.common.darkNeutral,
    },
    productItemImage: {
      position: "relative",
      width: 45,
      height: 45,
      overflow: "clip",
      borderRadius: theme.shape.borderRadius / 3,
    },
    productItemContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    productOfferStatus: {
      textAlign: "right",
      marginBottom: theme.spacing(0.5),
      [theme.breakpoints.down("tablet")]: {
        textAlign: "left",
      },
    },
    productActions: {
      display: "flex",
      justifyContent: "flex-end",
      gap: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        "& button": {
          width: "100%",
        },
      },
    },
  };
});

export default useStyles;
