import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "disabled">({
  name: "SellerCard",
  uniqId: "c1rVyM",
})((theme, _, classes) => {
  return {
    root: {
      overflow: "hidden",
    },
    sellerContent: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2.5),
    },
    sellerProfile: {
      display: "flex",
      gap: theme.spacing(2.5),
    },
    sellerProfileText: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    sellerActionList: {
      width: "100%",
    },
    salesOwnerActionList: {
      padding: theme.spacing(2.5, 0),
      paddingTop: 0,
      display: "flex",
      flexDirection: "column",
      margin: theme.spacing(-(1 + 1.25 / 2), 0),
    },
    salesOwnerActionItem: {
      width: "100%",
      paddingTop: theme.spacing(1 + 1.25 / 2),
      paddingBottom: theme.spacing(1 + 1.25 / 2),
      justifyContent: "flex-start",
      gap: theme.spacing(1),
      [`&.${classes.disabled}`]: {
        color: theme.palette.text.disabled,
      },
    },
    offerForm: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2.5),
    },
    disabled: {},
  };
});

export default useStyles;
