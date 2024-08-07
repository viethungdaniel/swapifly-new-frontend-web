import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "disabled">({
  name: "ProductContent",
  uniqId: "uh26Uo",
})((theme, _, classes) => {
  return {
    soldStatusChip: {
      width: "auto",
      backgroundColor: theme.palette.common.darkNeutral,
      color: theme.palette.common.white,
    },
    typicalItem: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
    typicalItemIcon: {
      fontSize: 20,
      color: theme.palette.text.secondary,
    },
    typicalItemContent: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    relatedMenuList: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2.5),
    },
    relatedMenuItem: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
    },
    seller: {
      width: "100%",
      display: "flex",
      gap: theme.spacing(2.5),
    },
    sellerAvatar: {
      width: 94,
      height: 94,
    },
    sellerInfo: {
      display: "flex",
      flexDirection: "column",
      overflowX: "clip",
      gap: theme.spacing(0.5),
    },
    sellerInfoText: {
      display: "flex",
      flexWrap: "wrap",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    sellerInfoLargeIcon: {
      fontSize: 20,
    },
    addressList: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.25),
    },
    addressItem: {
      display: "flex",
      gap: theme.spacing(1.25),
    },
    addressItemContent: {
      marginTop: (20 - 21) / 2,
      minHeight: 21,
    },
    sellerInfoIcon: {
      color: theme.palette.common.blue,
      [`&.${classes.disabled}`]: {
        color: theme.palette.common.neutral,
      },
    },
    disabled: {},
  };
});

export default useStyles;
