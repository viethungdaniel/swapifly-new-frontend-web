import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "Thread",
})((theme) => {
  return {
    root: {
      minHeight: "auto",
      alignItems: "flex-end",
      gap: theme.spacing(1),
      paddingTop: theme.spacing(1.25),
      paddingBottom: theme.spacing(1.25),
    },
    blockMessage: {
      color: theme.palette.text.secondary,
      textAlign: "center",
      minHeight: 40,
      width: "100%",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
    startActions: {
      display: "flex",
      alignItems: "center",
      height: 40,
    },
    textingTextField: {
      alignItems: "flex-end",
    },
    textingInputAdornmentEnd: {
      alignItems: "flex-end",
      "& button": {
        marginTop: "-9.5px",
        marginBottom: "-9.5px",
      },
    },
    fileInput: {
      display: "none",
    },
  };
});

export default useStyles;
