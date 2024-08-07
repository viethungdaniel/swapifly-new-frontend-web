import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "OrderSummary",
})((theme) => {
  return {
    orderSummaryList: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(1.25),
    },
    orderSummaryItem: {
      display: "flex",
      gap: theme.spacing(0.5),
    },
  };
});

export default useStyles;
