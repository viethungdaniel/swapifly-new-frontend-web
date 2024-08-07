import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appSwiper",
})((theme) => {
  return {
    root: {
      position: "relative",
      "--swiper-pagination-bottom": "12px",
      "--swiper-pagination-bullet-horizontal-gap": "4px",
      "--swiper-pagination-bullet-inactive-opacity": "1",
    },
    pagination: {
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    },
    paginationBullet: {
      backgroundColor: theme.palette.common.lightNeutral,
      width: 8,
      height: 8,
      "&.swiper-pagination-bullet-active": {
        backgroundColor: theme.palette.common.darkNeutral,
      },
    },
    navigationArrow: {
      position: "absolute",
      top: "50%",
      zIndex: 99,
    },
    navigationArrowNext: {
      right: 24 / 2,
      translate: "100% -50%",
    },
    navigationArrowButton: {
      width: 24,
      height: 24,
      fontSize: 12,
      borderRadius: "50%",
      border: `1px solid ${theme.palette.common.lightNeutral}`,
      backgroundColor: theme.palette.common.white,
      scale: 1,
      transition: theme.transitions.create(["scale"]),
    },
    navigationArrowButtonDisabled: {
      scale: 0,
    },
    navigationArrowPrev: {
      left: 24 / 2,
      translate: "-100% -50%",
    },
    hidden: {
      display: "none",
    },
  };
});

export default useStyles;
