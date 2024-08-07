import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "UserAccountProfile",
})((theme) => {
  return {
    content: {
      paddingTop: theme.app.spacings.gutters,
      paddingBottom: theme.app.spacings.gutters,
      [theme.breakpoints.down("sm")]: {
        paddingTop: theme.app.spacings.guttersSmall,
        paddingBottom: theme.app.spacings.guttersSmall,
      },
    },
  };
});

export default useStyles;
