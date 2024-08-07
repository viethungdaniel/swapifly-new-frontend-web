import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "apps",
})((theme) => {
  return {
    root: {
      overflowX: "clip",
      background: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 390 85' preserveAspectRatio='none' fill='%23${theme.palette.primary.main.replace(
        "#",
        ""
      )}'%3E%3Crect x='390' y='85' width='390' height='85' transform='rotate(-180 390 85)' /%3E%3Cpath d='M390 85L-1.43051e-05 85L390 -2.75671e-07V85Z' fill='white' fill-opacity='0.2'/%3E%3C/svg%3E")`,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundSize: "100% 100%",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      height: "100vh",
      overflow: "hidden",
    },
    title: {
      fontWeight: 500,
      fontSize: theme.typography.pxToRem(74),
      textAlign: "center",
      color: theme.palette.common.white,
      lineHeight: "120%",
      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(28),
        lineHeight: "40px",
      },
    },
    subtitle: {
      fontWeight: 700,
      fontSize: theme.typography.pxToRem(104),
      textAlign: "center",
      color: theme.palette.common.white,
      lineHeight: "100%",
      [theme.breakpoints.down("md")]: {
        fontSize: theme.typography.pxToRem(44),
        lineHeight: "140%",
      },
    },
    homeBackButton: {
      minHeight: 60,
      paddingLeft: `calc(${theme.spacing((16 + 24) / 8)} - 1px)`,
      paddingRight: `calc(${theme.spacing((16 + 24) / 8)} - 1px)`,
      color: theme.palette.common.white,
      border: `1px solid ${theme.palette.common.white}`,
      borderRadius: theme.shape.borderRadius,
      marginTop: 40,
      marginBottom: 60,
      backgroundColor: alpha(theme.palette.common.white, 0.2),
      ...theme.typography.bodyMed16,
      "&:hover": {
        backgroundColor: alpha(
          theme.palette.common.white,
          0.2 + theme.palette.action.hoverOpacity
        ),
      },
      [theme.breakpoints.down("tablet")]: {
        minHeight: 40,
        ...theme.typography.bodyMed14,
        paddingLeft: `calc(${theme.spacing((16 + 4) / 8)} - 1px)`,
        paddingRight: `calc(${theme.spacing((16 + 4) / 8)} - 1px)`,
      },
    },
    thumbnail: {
      position: "relative",
      height: "auto",
      // height: 534,
    },
    thumbnailImg: {
      maxWidth: `calc(100% - ${theme.spacing(12)})`,
      height: "calc(100vh*534/1080 - 64px)",
      minHeight: 292,
      maxHeight: 534,
    },
  };
});

export default useStyles;
