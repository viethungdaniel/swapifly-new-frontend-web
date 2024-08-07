import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "404",
})((theme) => {
  return {
    root: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
    },
    content: {
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
    },
    n404Svg: {
      height: 140,
      marginBottom: theme.spacing(3),
    },
  };
});

export default useStyles;
