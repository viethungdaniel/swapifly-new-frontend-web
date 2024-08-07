import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SlugUser",
})((theme) => {
  return {
    content: {
      height: "100%",
      display: "flex",
      flexDirection: "column",
    },
    menu: {
      position: "relative",
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
      "&:before": {
        content: '""',
        position: "absolute",
        bottom: 0,
        left: 0,
        width: "100%",
        height: 1,
        transform: "100% 0",
        backgroundColor: theme.palette.divider,
      },
    },
    menuTab: {
      minHeight: 60,
    },
    menuTabs: {
      flex: 1,
    },
    menuAction: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(1.25),
    },
  };
});

export default useStyles;
