import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppBottomAppBar",
})((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.common.white,
      top: "auto",
      bottom: 0,
      zIndex: theme.zIndex.appBar + 10,
      boxShadow: theme.app.shadows.bottomAppBar,
    },
  };
});

export default useStyles;
