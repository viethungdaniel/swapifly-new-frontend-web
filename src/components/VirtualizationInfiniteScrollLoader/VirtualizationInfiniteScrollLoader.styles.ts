import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "VirtualizationInfiniteScrollLoader",
})(() => {
  return {
    vertical: {
      height: "100%",
    },
    horizontal: {
      width: "100%",
    },
  };
});

export default useStyles;
