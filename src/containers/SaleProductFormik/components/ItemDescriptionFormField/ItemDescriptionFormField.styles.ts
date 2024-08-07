import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "ItemDescriptionFormField",
})((theme) => {
  return {
    actions: {
      display: "flex",
      justifyContent: "center",
      marginTop: theme.spacing(1.25),
    },
    itemDescriptionTextField: {
      alignItems: "flex-end",
    },
    itemDescriptionInputAdornmentEnd: {
      alignItems: "flex-end",
    },
    aiSwapiflySvg: {
      height: 30,
    },
    selectStylePaper: {
      maxWidth: "100vw",
      maxHeight: "40vh",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
    },
    selectStyleList: {
      flex: 1,
      overflow: "auto",
    },
    selectStyleToolbar: {
      display: "flex",
      justifyContent: "center",
      padding: theme.spacing(1),
    },
  };
});

export default useStyles;
