import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "NotificationsSlug",
})((theme) => {
  return {
    main: {
      display: "flex",
      flexDirection: "column",
    },
    notificationImage: {
      width: "100%",
      height: "auto",
      marginBottom: theme.spacing(2.5),
    },
  };
});

export default useStyles;
