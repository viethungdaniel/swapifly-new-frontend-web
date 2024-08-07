import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxThreadTopBar",
})((theme) => {
  return {
    userAvatar: {
      width: 40,
      height: 40,
      marginRight: theme.spacing(1.25),
    },
    userInfo: {
      flex: 1,
    },
    backButton: {
      [theme.breakpoints.up("tablet")]: {
        display: "none",
      },
    },
  };
});

export default useStyles;
