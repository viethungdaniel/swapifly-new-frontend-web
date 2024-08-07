import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "active">({
  name: "productCategoryAutocomplete",
  uniqId: "W7JGTv",
})((theme, _, classes) => {
  return {
    productCategoryList: {
      maxHeight: "40vh",
      overflow: "auto",
    },
    buttonEndIcon: {
      transform: "rotate(0)",
      transition: theme.transitions.create(["transform"]),
      [`&.${classes.active}`]: {
        transform: "rotate(180deg)",
      },
    },
    categoryButtonText: {
      maxWidth: 120,
      overflow: "hidden",
    },
    categorySearch: {
      padding: theme.spacing(1.25, 2.5, 0),
    },
    categoryItemImage: {
      position: "relative",
      width: 40,
      height: 30,
    },
    toggleAction: {
      display: "flex",
      padding: theme.spacing(0.5),
      margin: theme.spacing(-0.5),
      color: theme.palette.text.primary,
      transform: "rotate(-90deg)",
      transition: theme.transitions.create(["transform"]),
      "&:hover": {
        color: theme.palette.primary.main,
      },
      [`&.${classes.active}`]: {
        transform: "rotate(0deg)",
      },
    },
    toggleActionIcon: {
      color: "inherit",
      fontSize: 20,
    },
    active: {},
  };
});

export default useStyles;
