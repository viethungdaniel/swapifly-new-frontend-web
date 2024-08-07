import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "search",
})((theme) => {
  return {
    sales: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2.5),
    },
  };
});

export default useStyles;
