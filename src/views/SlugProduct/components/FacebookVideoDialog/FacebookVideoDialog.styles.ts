import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "FacebookVideoDialog",
})((theme) => {
  return {
    dialogPaper: {
      backgroundColor: theme.palette.common.black,
    },
    dialogTitle: {
      backgroundColor: `${theme.palette.common.black} !important`,
    },
    dialogContent: {
      overflow: "clip",
      position: "relative",
    },
    facebookPlayer: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  };
});

export default useStyles;
