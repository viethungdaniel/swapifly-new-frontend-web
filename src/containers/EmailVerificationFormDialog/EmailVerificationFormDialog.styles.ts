import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "EmailVerificationFormDialog",
})((theme) => {
  return {
    submissionSuccessContent: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    submissionSuccessSvg: {
      height: 92,
      marginBottom: theme.spacing(3.75),
    },
  };
});

export default useStyles;
