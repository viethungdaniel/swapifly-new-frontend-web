import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "StickyAppBar",
})((theme) => {
  return {
    root: {
      zIndex: 100,
    },
    sticking: {
      backgroundColor: theme.palette.common.white,
    },
  };
});

export default useStyles;
