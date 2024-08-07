import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "TabPanelSellerDetails",
})((theme, _, classes) => {
  return {
    title: {
      flex: 1,
      [theme.breakpoints.down("tablet")]: {
        "& span": {
          display: "none",
        },
      },
    },
    titleDivider: {
      [theme.breakpoints.down("tablet")]: {
        display: "none",
      },
    },
    verificationRequestButton: {
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    },
    sellerInfoContent: {
      display: "flex",
      flexDirection: "column",
      overflow: "clip",
    },
    sellerInfoStatus: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(1.25, 0),
    },
    sellerInfoItem: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1),
    },
  };
});

export default useStyles;
