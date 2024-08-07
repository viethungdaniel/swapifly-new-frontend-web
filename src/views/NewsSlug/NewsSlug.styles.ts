import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "NewsSlug",
})((theme) => {
  return {
    thumbnail: {
      width: "100%",
      height: "auto",
      marginBottom: theme.spacing(2.5),
    },
    prevNextArticleNavigation: {
      display: "flex",
      gap: theme.spacing(1.25),
    },
    prevNextArticleNavigationActions: {
      display: "flex",
      flexDirection: "column",
      overflow: "hidden",
    },
    recentNewsSwiperSlide: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
    },
    recentNewsSwiperSlideThumbnail: {
      position: "relative",
      width: "100%",
      paddingTop: "calc(100%*190/285)",
    },
    recentNewsSwiperTitle: {
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.spacing(1.25),
      marginBottom: theme.spacing(1.25),
    },
  };
});

export default useStyles;
