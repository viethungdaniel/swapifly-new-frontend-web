import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "News",
})((theme) => {
  return {
    newsList: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(5),
    },
    newsItem: {
      display: "flex",
      gap: theme.spacing(2.5),
    },
    newsItemMedia: {
      width: 280,
      [theme.breakpoints.down("tablet")]: {
        width: 200,
      },
      [theme.breakpoints.down("sm")]: {
        width: 120,
      },
    },
    newsItemMediaPhoto: {
      width: "100%",
      position: "relative",
      paddingTop: "calc(100%*190/286)",
    },
    newsItemContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: theme.spacing(1.25),
    },
    pagination: {
      marginTop: theme.spacing(2.5),
      display: "flex",
      justifyContent: "flex-end",
      [theme.breakpoints.down("tablet")]: {
        justifyContent: "center",
      },
    },
    newsItemContentTitle: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
    newsItemContentDescription: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
  };
});

export default useStyles;
