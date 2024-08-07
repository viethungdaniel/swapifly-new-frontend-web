import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appAvatar",
})((theme) => {
  return {
    root: {
      color: theme.palette.primary.main,
    },
    userIcon: {
      width: "100%",
      height: "100%",
      color: "inherit",
      backgroundColor: theme.palette.common.white,
    },
  };
});

export default useStyles;
