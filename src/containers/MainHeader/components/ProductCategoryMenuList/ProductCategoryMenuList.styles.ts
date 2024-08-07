import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "productCategoryMenuList",
})((theme) => {
  return {
    root: {
      width: `calc(100% + ${theme.spacing(3.75 * 2)})`,
      height: "100%",
      marginLeft: theme.spacing(-3.75),
      marginRight: theme.spacing(-3.75),
    },
    menuList: {
      height: "100%",
      display: "flex",
      alignItems: "stretch",
      justifyContent: "space-between",
    },
    menuItem: {
      paddingLeft: theme.spacing(3.75),
      paddingRight: theme.spacing(3.75),
      color: theme.palette.common.white,
    },
    menuItemText: {
      display: "block",
    },
  };
});

export default useStyles;
