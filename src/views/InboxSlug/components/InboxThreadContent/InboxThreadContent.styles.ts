import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxThreadMessage",
})(() => {
  return {
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    loadingOverlay: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    inboxThreadMessageBodyContainer: {
      flex: 1,
      position: "relative",
    },
  };
});

export default useStyles;
