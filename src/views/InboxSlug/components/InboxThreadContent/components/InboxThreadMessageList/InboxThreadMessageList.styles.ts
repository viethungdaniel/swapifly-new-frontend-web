import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxThreadMessageList",
})((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
      position: "relative",
    },
    inboxThreadMessageList: {
      position: "relative",
    },
    inboxThreadMessageItemLoading: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: theme.spacing(1.25),
    },
    hidden: {
      opacity: 0,
    },
    bottomRightActions: {
      position: "absolute",
      bottom: theme.spacing(3),
      right: theme.spacing(3),
      display: "flex",
      flexDirection: "column",
      [theme.breakpoints.down("sm")]: {
        bottom: theme.spacing(2),
        right: theme.spacing(2),
      },
    },
    inboxThreadMessageContainer: {
      flex: 1,
    },
    bottomScrollButton: {
      filter: "drop-shadow(0px 2px 4px rgba(27, 46, 94, 0.08))",
      rotate: "180deg",
    },
    inboxThreadAiChatStatus: {
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
    inboxThreadAiChatStatusReplacement: {
      opacity: 0,
    },
  };
});

export default useStyles;
