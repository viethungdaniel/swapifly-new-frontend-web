import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PageRequiredAuth",
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
      alignItems: "center",
    },
    n401Svg: {
      height: 140,
      marginBottom: theme.spacing(3),
    },
  };
});

export default useStyles;
