import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "Root",
})((theme) => {
  return {
    notificationTitle: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      marginBottom: theme.spacing(0.5),
    },
    notificationContent: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 3,
      WebkitBoxOrient: "vertical",
    },
    notificationIcon: {
      fontSize: 24,
      position: "absolute",
      top: "50%",
      left: "50%",
      translate: "-50% -50%",
    },
    notificationIconWrapper: {
      position: "relative",
      width: 46,
      height: 46,
      borderRadius: "50%",
      overflow: "clip",
      backgroundColor: theme.palette.common.lighterNeutral,
    },
    notificationImage: {
      width: 46,
      height: 46,
      borderRadius: "50%",
    },
  };
});

export default useStyles;
