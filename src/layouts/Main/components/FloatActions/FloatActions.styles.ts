import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "floatActions",
})((theme) => {
  return {
    root: {
      position: "fixed",
      bottom: `calc(60px + ${theme.spacing(3)})`,
      // right: `max(calc(100vw - (((100vw - ${
      //   theme.breakpoints.values.xl
      // }px)/2) + ${theme.breakpoints.values.xl}px + ${containerPadding}*2) - ${
      //   115 / 2
      // }px),${containerPadding})`,
      right: theme.spacing(3),
      zIndex: theme.zIndex.appBar,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(3.75),
      [theme.breakpoints.down("tablet")]: {
        // bottom: `calc(80px + ${theme.spacing(3)})`,
        gap: theme.spacing(2.5),
      },
      [theme.breakpoints.down("sm")]: {
        right: theme.spacing(2),
        // bottom: `calc(80px + ${theme.spacing(2)})`,
        // right: `max(calc(100vw - (((100vw - ${theme.breakpoints.values.xl}px)/2) + ${theme.breakpoints.values.xl}px + ${containerSmPadding}*2)),${containerSmPadding})`,
      },
    },
    scrollTopButton: {
      filter: "drop-shadow(0px 2px 4px rgba(27, 46, 94, 0.08))",
    },
    sellButton: {
      [theme.breakpoints.up("tablet")]: {
        filter: "brightness(1)",
        transition: theme.transitions.create(["filter"]),
        "&:hover": {
          filter: `brightness(${theme.palette.action.hoverOpacity + 1})`,
          "& .sell-fab_svg__root-shadow": {
            opacity: 0.3,
          },
        },
      },
    },
    sellButtonSvg: {
      width: 116 + 40,
      marginBottom: 119.26 - 158.96,
      marginLeft: (115.52 - (116 + 40)) / 2,
      marginRight: (115.52 - (116 + 40)) / 2,
      [theme.breakpoints.down("tablet")]: {
        width: 95,
        marginBottom: 72.62 - 96.8,
        marginLeft: (70.34 - 95) / 2,
        marginRight: (70.34 - 95) / 2,
      },
      [theme.breakpoints.up("tablet")]: {
        "& .sell-fab_svg__root-shadow": {
          opacity: 0,
          transition: theme.transitions.create(["opacity"]),
        },
      },
    },
  };
});

export default useStyles;
