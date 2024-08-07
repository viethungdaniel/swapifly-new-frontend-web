import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppTabPanel",
})(() => {
  return {
    hidden: {
      display: "none",
    },
  };
});

export default useStyles;
