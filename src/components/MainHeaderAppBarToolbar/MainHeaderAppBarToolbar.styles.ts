import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "mainHeaderAppToolbar",
})((theme) => {
  return {
    root: {
      width: "100%",
      position: "relative",
      height: 80,
      minHeight: 80,
      [theme.breakpoints.down("tablet")]: {
        height: 80,
        minHeight: 80,
      },
    },
  };
});

export default useStyles;
