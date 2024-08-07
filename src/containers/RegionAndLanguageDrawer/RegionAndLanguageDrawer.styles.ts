import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "active" | "toggleButton">({
  name: "ProductCategoryListDrawer",
  uniqId: "Snb8uG",
})((theme, _, classes) => {
  return {
    titleIconButton: {
      "& .MuiIcon-root": {
        fontSize: 20,
      },
    },
    productCategoryItem: {
      padding: theme.spacing(2.5, 3),
      paddingRight: `calc(24px + ${theme.spacing(3.75)} + ${theme.spacing(3)})`,
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(2.5, 2),
        paddingRight: `calc(24px + ${theme.spacing(3.75)} + ${theme.spacing(
          2
        )})`,
      },
    },
    productCategoryItemPhoto: {
      position: "relative",
      width: 100,
      minWidth: 100,
      height: 70,
    },
    childProductCategoryItem: {
      paddingLeft: theme.spacing(3 * 2),
    },
    childProductCategoryDivider: {
      marginLeft: theme.spacing(3.75 * 2),
    },
    toggle: {
      position: "absolute",
      top: "50%",
      right: theme.spacing(3.75),
      transform: "translateY(-50%)",
      display: "flex",
    },
    toggleButton: {
      transform: "rotate(-90deg)",
      transition: theme.transitions.create(["transform"]),
      [`.${classes.active} &`]: {
        transform: "rotate(0deg)",
      },
    },
    active: {},
  };
});

export default useStyles;
