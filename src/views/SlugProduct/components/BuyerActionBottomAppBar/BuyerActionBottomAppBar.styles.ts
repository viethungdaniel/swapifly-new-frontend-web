import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "BuyerActionBottomAppBar",
  uniqId: "dq0Ykm",
})((theme) => {
  return {
    actionList: {
      gap: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(2),
      },
    },
  };
});

export default useStyles;
