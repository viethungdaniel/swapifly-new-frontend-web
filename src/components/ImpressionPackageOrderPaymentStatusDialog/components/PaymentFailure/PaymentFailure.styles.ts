import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PaymentFailure",
})(() => {
  return {
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
  };
});

export default useStyles;
