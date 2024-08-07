import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SimilarProductList",
})((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2.5),
    },
    content: {
      display: "flex",
      flexDirection: "column",
    },
    actions: {
      marginTop: theme.spacing(3.75),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
});

export default useStyles;
