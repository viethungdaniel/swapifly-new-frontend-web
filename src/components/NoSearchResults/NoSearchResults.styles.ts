import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "noSearchResults",
})((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
    },
    container: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
    content: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      gap: theme.spacing(1.25),
      padding: theme.spacing(3.75, 0),
    },
    icon: {
      height: 80,
      fontSize: 80,
    },
  };
});

export default useStyles;
