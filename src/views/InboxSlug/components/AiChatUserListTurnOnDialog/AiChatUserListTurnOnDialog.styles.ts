import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AiChatUserListTurnOnDialog",
})((theme) => {
  return {
    dialogContent: {
      display: "flex",
      flexDirection: "column",
      padding: "0px !important",
    },
    userContainer: {
      flex: 1,
      padding: theme.spacing(0, 3),
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
    userList: {
      position: "relative",
    },
    userItem: {
      borderTop: `1px solid ${theme.palette.divider}`,
    },
  };
});

export default useStyles;
