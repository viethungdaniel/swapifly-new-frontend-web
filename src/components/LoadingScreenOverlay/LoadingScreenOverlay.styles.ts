import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "LoadingScreenOverlay",
  uniqId: "uDtiEy",
})((theme) => {
  return {
    root: {
      backgroundColor: "rgba(0,0,0,0.5)",
      zIndex: 2000,
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing(2),
    },
    loadingIcon: {
      fontSize: 40,
      color: theme.palette.common.white,
    },
  };
});

export default useStyles;
