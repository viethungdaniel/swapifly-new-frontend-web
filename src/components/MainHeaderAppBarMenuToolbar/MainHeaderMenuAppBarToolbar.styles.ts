import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "mainHeaderMenuAppBarToolbar",
})(() => {
  return {
    root: {
      width: "100%",
      position: "relative",
      height: 50,
      minHeight: 50,
    },
  };
});

export default useStyles;
