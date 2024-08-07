import { darken } from "@mui/material";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxThread",
})((theme) => {
  return {
    root: {
      width: 400,
      maxWidth: "100%",
      maxHeight: "100%",
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    },
    inboxThread: {
      flex: 1,
      width: "100%",
      height: "100%",
    },
    inboxThreadList: {
      position: "relative",
    },
    inboxThreadItem: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      alignItems: "flex-start",
    },
    inboxThreadItemText: {
      flex: 1,
      overflow: "hidden",
    },
    inboxThreadItemTextSectionA: {
      display: "flex",
      gap: theme.spacing(1.25),
      marginBottom: theme.spacing(0.5),
    },
    inboxThreadItemTextSectionB: {
      display: "flex",
      gap: theme.spacing(1.25),
      overflow: "hidden",
    },
    inboxThreadItemOffer: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(0.5),
      minHeight: 24,
    },
    inboxThreadItemProductImage: {
      position: "relative",
      width: 50,
      height: 50,
      borderRadius: theme.shape.borderRadius / 3,
      overflow: "clip",
    },
    inboxThreadAdItem: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      alignItems: "flex-start",
      backgroundColor: theme.palette.common.lightBlue,
      "&:hover": {
        backgroundColor: darken(
          theme.palette.common.lightBlue,
          theme.palette.action.hoverOpacity
        ),
      },
    },
    inboxThreadAdItemVideo: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      objectFit: "cover",
      objectPosition: "center",
    },
    inboxThreadItemProductSoldTag: {
      position: "absolute",
      bottom: 0,
      left: 0,
      width: "100%",
      textAlign: "center",
      color: theme.palette.common.white,
      backgroundColor: theme.palette.common.darkNeutral,
    },
    inboxThreadItemAvatar: {
      width: 50,
      height: 50,
      marginRight: theme.spacing(1.25),
    },
  };
});

export default useStyles;
