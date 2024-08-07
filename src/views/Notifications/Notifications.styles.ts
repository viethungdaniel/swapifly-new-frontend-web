import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "Notifications",
})((theme) => {
  return {
    main: {
      display: "flex",
      flexDirection: "column",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(3.75),
    },
    actions: {
      marginTop: theme.spacing(3.75),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    notificationItem: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
      padding: theme.spacing(2.5, `${theme.app.spacings.gutters}px`),
      margin: theme.spacing(0, `-${theme.app.spacings.gutters}px`),
      "&:hover": {
        backgroundColor: theme.palette.action.hover,
      },
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2.5, `${theme.app.spacings.guttersSmall}px`),
        margin: theme.spacing(0, `-${theme.app.spacings.guttersSmall}px`),
      },
    },
    notificationItemDivider: {
      position: "relative",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: "50%",
        translate: "-50% 0",
        width: `calc(100% - ${theme.app.spacings.gutters}px*2)`,
        height: 1,
        backgroundColor: theme.palette.divider,
        [theme.breakpoints.down("sm")]: {
          width: `calc(100% - ${theme.app.spacings.guttersSmall}px*2)`,
        },
      },
    },
    notificationItemDateTime: {
      display: "flex",
      alignItems: "center",
    },
    notificationItemDot: {
      width: 10,
      height: 10,
      borderRadius: "50%",
      backgroundColor: theme.palette.common.dotRed,
    },
    notificationItemContent: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
    },
    notificationItemRead: {
      color: theme.palette.text.secondary,
    },
  };
});

export default useStyles;
