import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppToolbar",
})(() => {
  return {
    root: {
      minHeight: 60,
    },
  };
});

export default useStyles;
