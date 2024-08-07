import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SellerActionCard",
})((theme) => {
  return {
    content: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(2.5),
    },
  };
});

export default useStyles;
