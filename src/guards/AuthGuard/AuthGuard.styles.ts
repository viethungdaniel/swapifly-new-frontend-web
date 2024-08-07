import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "authGuard",
})((theme) => {
  return {
    loadingDialog: {
      zIndex: theme.zIndex.modal + 50,
    },
    loading: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingContent: {
      position: "relative",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
    loadingContentLogo: {
      height: 80,
      width: "auto",
      maxWidth: "calc(100% - 24px*2)",
    },
    loadingLinearProgress: {
      position: "absolute",
      bottom: theme.spacing(-4),
      left: "50%",
      transform: "translate(-50%,100%)",
      width: 120,
      maxWidth: "calc(100vw - 32px)",
    },
  };
});

export default useStyles;
