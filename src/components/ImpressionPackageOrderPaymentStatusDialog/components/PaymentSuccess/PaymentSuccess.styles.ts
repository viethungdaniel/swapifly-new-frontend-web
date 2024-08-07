import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PaymentSuccess",
})((theme) => {
  return {
    content: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    product: {
      marginBottom: theme.spacing(3.75),
      pointerEvents: "none",
      display: "flex",
      maxWidth: "100%",
    },
  };
});

export default useStyles;
