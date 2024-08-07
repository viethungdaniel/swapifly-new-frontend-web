import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SmartAppBannerToolbar",
})(() => {
  return {
    root: {
      width: "100%",
      position: "relative",
      height: 86,
      minHeight: 86,
    },
  };
});

export default useStyles;
