import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "disabled">({
  name: "UserInfo",
  uniqId: "K0gycD",
})((theme, _, classes) => {
  return {
    root: {
      position: "relative",
      width: 300,
      maxWidth: "100%",
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(3.75),
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
        paddingLeft: 0,
        paddingRight: 0,
      },
    },
    userAvatar: {
      position: "relative",
      width: 140,
      height: 140,
      border: `4px solid ${theme.palette.background.default}`,
      borderRadius: "50%",
      marginBottom: theme.spacing(2.5),
      marginTop: -((140 * 1) / 3),
      [theme.breakpoints.down("tablet")]: {
        paddingLeft: 0,
        paddingRight: 0,
        marginTop: -((140 * 1) / 2),
      },
      [theme.breakpoints.down("sm")]: {
        width: 80,
        height: 80,
        marginTop: -((80 * 1) / 2),
        marginBottom: theme.spacing(1),
      },
    },
    userAvatarPhoto: {
      width: "100%",
      height: "100%",
    },
    userAvatarMerchantTag: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      pointerEvents: "none",
    },
    userInfoText: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    userInfoBottom: {
      marginBottom: theme.spacing(1),
    },

    merchantVerifiedDropdownButton: {
      marginTop: theme.spacing(2.5),
      [theme.breakpoints.down("tablet")]: {
        marginTop: theme.spacing(1.25),
        marginBottom: theme.spacing(1.25),
      },
    },
    merchantVerifiedDropdownArrowDownIcon: {
      transition: theme.transitions.create(["rotate"], {
        duration: theme.transitions.duration.shortest,
      }),
    },
    merchantVerifiedMenuItem: {
      alignItems: "flex-start",
    },
    merchantVerifiedMenuItemIcon: {
      fontSize: 24,
    },
    merchantVerifiedMenuItemText: {
      minHeight: 21,
      margin: 0,
      marginTop: (24 - 21) / 2,
    },
    floatAction: {
      position: "absolute",
      top: 140 / 2,
      right: 0,
      paddingTop: theme.spacing(2),
      display: "flex",
      gap: theme.spacing(2),
      [theme.breakpoints.down("sm")]: {
        top: 80 / 2,
        gap: theme.spacing(1),
        paddingTop: theme.spacing(1),
      },
    },

    userInfoIcon: {
      color: theme.palette.common.blue,
      [`&.${classes.disabled}`]: {
        color: theme.palette.common.neutral,
      },
    },
    disabled: {},
  };
});

export default useStyles;
