import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "smartAppBannerAppBar",
})((theme) => {
  return {
    mediaSocialSwiperSlide: {
      width: 60,
      height: 60,
    },
    mediaSocialButton: {
      width: 60,
      height: 60,
      borderRadius: "50%",
      border: `1px solid ${theme.palette.common.lightNeutral}`,
      color: "var(--color)",
      "&:hover": {
        backgroundColor: "var(--hovered-color)",
      },
    },
    mediaSocialIcon: {
      fontSize: 34,
      pointerEvents: "none",
    },
    swiperWrapper: {
      justifyContent: "space-between",
    },
    swiperRoot: {
      marginBottom: theme.spacing(3.75),
    },
    link: {
      display: "flex",
      alignItems: "center",
      gap: theme.spacing(2),
      backgroundColor: theme.palette.common.lighterNeutral,
      paddingLeft: theme.spacing(2),
      height: theme.app.sizes.medium,
      borderRadius: theme.shape.borderRadius,
    },
    linkIcon: {
      fontSize: 20,
    },
  };
});

export default useStyles;
