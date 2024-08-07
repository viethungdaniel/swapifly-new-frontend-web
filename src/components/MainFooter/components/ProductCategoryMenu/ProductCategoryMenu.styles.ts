import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "selected">({
  name: "productCategoryMenus",
  uniqId: "kiDxFs",
})((theme, _, classes) => {
  return {
    root: {
      paddingBottom: theme.spacing(1.25),
    },
    productCategoryList: {
      display: "flex",
      flexDirection: "column",
    },
    childProductCategoryList: {
      display: "flex",
      alignItems: "center",
      flexWrap: "wrap",
      gap: theme.spacing(0.5, 1.25),
    },
    productCategoryItemHover: {
      "&:hover": {
        color: theme.palette.primary.main,
        "& *": {
          color: theme.palette.primary.main,
        },
      },
    },
    childProductCategoryItem: {
      "&:before": {
        content: '"•"',
        marginRight: theme.spacing(1.25),
      },
      "&:first-of-type": {
        "&:before": {
          content: '""',
          marginRight: 0,
        },
      },
    },
    productCategoryItemCollapseButton: {
      position: "absolute",
      top: "50%",
      right: theme.spacing(3),
      pointerEvents: "none",
      transform: "translateY(-50%)",
      transition: theme.transitions.create(["transform"]),
      [theme.breakpoints.down("sm")]: {
        right: theme.spacing(2),
      },
      [`.${classes.selected} &`]: {
        transform: "translateY(-50%) rotate(180deg)",
      },
    },

    mobileProductCategoryItem: {
      flexDirection: "column",
      justifyContent: "flex-start",
      alignItems: "stretch",
    },
    mobileProductCategoryItemTitle: {
      position: "relative",
    },
    selected: {},
  };
});

export default useStyles;
