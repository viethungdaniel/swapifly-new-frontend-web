import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "sectionProductListCategoryList",
})((theme) => {
  return {
    categoryList: {
      display: "flex",
      flexDirection: "column",
    },
    categoryItem: {
      display: "flex",
      flexDirection: "column",
    },
    categoryItemTitle: {
      display: "flex",
      padding: theme.spacing(2, 0),
    },
    categoryItemActions: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
    },
  };
});

export default useStyles;
