import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "me" | "messageStart" | "messageEnd">({
  name: "InboxThreadMessageContent",
  uniqId: "onjnYg",
})((theme, _, classes) => {
  return {
    root: {
      minHeight: "auto",
      flexDirection: "column",
      alignItems: "flex-start",
      paddingTop: theme.spacing(1.25 / 2),
      paddingBottom: theme.spacing(1.25 / 2),
      [`&.${classes.me}`]: {
        direction: "rtl",
      },
      [`&.${classes.messageStart}`]: {
        paddingTop: 0,
      },
      [`&.${classes.messageEnd}`]: {
        paddingBottom: 0,
      },
    },
    tyingEffectSvg: {
      height: 12,
      width: "auto",
      fill: theme.palette.common.neutral,
    },
    swapiflyAITypingToolbar: {
      [`&.${classes.messageEnd}`]: {
        paddingBottom: theme.spacing(1.25 / 2),
      },
    },
    messageStart: {},
    messageEnd: {},
    messageDate: {
      width: "100%",
      textAlign: "center",
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(2.5),
      color: theme.palette.text.secondary,
      [`.${classes.messageStart} &`]: {
        paddingTop: theme.spacing(2.5),
      },
    },
    user: {
      display: "flex",
      alignItems: "flex-end",
      gap: theme.spacing(1.25),
    },
    userAvatar: {
      width: 40,
      height: 40,
    },
    userMessageBox: {
      padding: theme.spacing(1.25, 2),
      borderRadius: theme.shape.borderRadius / 1.5,
      border: `1px solid ${theme.palette.divider}`,
      whiteSpace: "pre-line",
      display: "flex",
      [`.${classes.me} &`]: {
        backgroundColor: theme.palette.common.lightBlue,
        direction: "ltr",
      },
    },
    userMessage: {
      flex: 1,
    },
    userMessageBoxImage: {
      width: 160,
      height: "auto",
      borderRadius: theme.shape.borderRadius / 3,
      cursor: "pointer",
      maxWidth: "100%",
    },
    userHelperText: {
      marginTop: theme.spacing(0.5),
      marginLeft: `calc(40px + ${theme.spacing(1.25)})`,
      color: theme.palette.text.secondary,
      [`.${classes.me} &`]: {
        marginLeft: "initial",
        marginRight: `calc(40px + ${theme.spacing(1.25)})`,
      },
    },
    swapiflyAISvg: {
      height: 42,
      width: 50,
      margin: "-1px -5px",
    },
    me: {},
  };
});

export default useStyles;
