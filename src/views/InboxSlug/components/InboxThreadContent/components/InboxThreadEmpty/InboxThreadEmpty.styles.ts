import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxThreadEmpty",
})((theme) => {
  return {
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: theme.palette.common.lighterNeutral,
    },
    inboxUserChattingSvg: {
      height: 200,
      width: 200,
      maxWidth: "100%",
      marginBottom: theme.spacing(3.75),
    },
  };
});

export default useStyles;
