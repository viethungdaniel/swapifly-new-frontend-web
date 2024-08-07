import { makeStyles } from "tss-react/mui";

type StylesParams = {
  desktopHomeBannerWidth: number;
  desktopHomeBannerHeight: number;
  mobileHomeBannerWidth: number;
  mobileHomeBannerHeight: number;
};

const useStyles = makeStyles<StylesParams>({
  name: "sectionBanner",
})((theme, params) => {
  return {
    root: {
      overflowX: "clip",
    },
    bannerItem: {
      position: "relative",
      width: "100%",
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundColor: "rgba(255, 255, 255, 0.3)",
        zIndex: 1,
      },
    },
    bannerLoading: {
      position: "relative",
    },
    bannerLoadingSkeleton: {
      position: "absolute",
      top: 0,
      left: 0,
      zIndex: 1,
      width: "100%",
      height: "100%",
    },
    bannerLoadingSpacing: {
      paddingTop: `calc(100%*${params.desktopHomeBannerHeight}/${params.desktopHomeBannerWidth})`,
      [theme.breakpoints.down("tablet")]: {
        paddingTop: `calc(100%*${params.mobileHomeBannerHeight}/${params.mobileHomeBannerWidth})`,
      },
    },
    bannerItemPrimary: {
      position: "relative",
      zIndex: 2,
      width: "100%",
      height: "100%",
    },
    bannerItemPrimaryContainer: {
      position: "relative",
    },
    bannerItemPrimaryBanner: {
      position: "relative",
      display: "flex",
      paddingTop: `calc(100%*${params.desktopHomeBannerHeight}/${params.desktopHomeBannerWidth})`,
      [theme.breakpoints.down("tablet")]: {
        paddingTop: `calc(100%*${params.mobileHomeBannerHeight}/${params.mobileHomeBannerWidth})`,
      },
    },
    bannerItemSecondaryImage: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
    bannerItemBackgroundBlur: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      zIndex: 1,
      backdropFilter: "blur(30px)",
      [theme.breakpoints.down("tablet")]: {
        display: "none",
      },
    },
    bannerImage: {
      [theme.breakpoints.down("tablet")]: {
        display: "none !important",
      },
    },
    bannerMobileImage: {
      [theme.breakpoints.up("tablet")]: {
        display: "none !important",
      },
    },
  };
});

export default useStyles;
