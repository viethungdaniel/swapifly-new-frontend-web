import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "sectionRecommendedProductList",
})((theme) => {
  return {
    root: {
      overflowX: "clip",
      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' preserveAspectRatio='none' viewBox='0 0 1440 648' fill='none'%3E%3Crect width='1440' height='648' fill='%23${theme.palette.primary.main.replace(
        "#",
        ""
      )}'/%3E%3Cpath d='M0 0H1440L0 648V0Z' fill='white' fill-opacity='0.2'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(5),
      [theme.breakpoints.down("md")]: {
        gap: theme.spacing(4),
      },
      [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(3),
      },
    },
    swiperSlide: {
      height: "auto",
      [theme.breakpoints.down("tablet")]: {
        width: "calc(100% - 30px*8)",
      },
      [theme.breakpoints.down("sm")]: {
        width: "calc(100% - 30px*4)",
      },
    },
    recommendedProductItemLogo: {
      position: "relative",
      width: "100%",
      paddingTop: "100%",
      backgroundColor: theme.palette.common.lighterNeutral,
      borderRadius: "50%",
      overflow: "hidden",
    },
    recommendedProductActions: {
      display: "flex",
      justifyContent: "center",
    },
  };
});

export default useStyles;
