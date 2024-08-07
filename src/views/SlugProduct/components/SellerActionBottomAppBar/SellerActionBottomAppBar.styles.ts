import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SellerActionBottomAppBar",
  uniqId: "dq0Ykm",
})((theme) => {
  return {
    actionList: {
      display: "flex",
      gap: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        gap: theme.spacing(2),
      },
    },
    actionListButton: {
      flex: 1,
      overflow: "hidden",
    },
    mainBottomAppBarToolbar: {
      flexDirection: "column",
      justifyContent: "center",
      "& > *": {
        width: "100%",
      },
    },
  };
});

export default useStyles;
