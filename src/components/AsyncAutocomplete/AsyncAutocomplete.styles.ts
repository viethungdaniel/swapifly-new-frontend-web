import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles()(() => {
  return {
    option: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "auto",
    },
    listBox: {
      // maxHeight: "initial"
    },
  };
});

export default useStyles;
