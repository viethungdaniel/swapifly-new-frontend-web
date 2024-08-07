import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "loading">({
  name: "UserAvatarFormField",
  uniqId: "G0F6c9",
})((theme, _, classes) => {
  return {
    root: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(0.5),
    },
    avatarWrapper: {
      position: "relative",
      display: "flex",
      cursor: "pointer",
    },
    avatar: {
      width: 94,
      height: 94,
      [`.${classes.loading} &`]: {
        opacity: theme.palette.action.disabledOpacity,
      },
    },
    avatarLoading: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    actions: {
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(1),
    },
    title: {
      [`.${classes.loading} &`]: {
        color: theme.palette.common.neutral,
      },
    },
    loading: {},
  };
});

export default useStyles;
