import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AlertDialog",
})((theme) => {
  return {
    dialog: {
      zIndex: theme.zIndex.modal + 25,
    },
    dialogPaper: {},
    dialogTitleText: {
      overflow: "initial",
      whiteSpace: "initial",
    },
    dialogContent: {},
    dialogActions: {
      display: "flex",
      justifyContent: "center",
      gap: theme.spacing(2),
      "& > .MuiButton-root,& > .MuiButtonBase-root": {
        marginLeft: 0,
      },
      [theme.breakpoints.down("sm")]: {
        flexDirection: "column-reverse",
      },
    },
    dialogActionsButton: {},
  };
});

export default useStyles;
