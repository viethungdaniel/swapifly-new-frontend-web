import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "collapsed">({
  name: "ReadMoreTypography",
})((theme, _, classes) => {
  return {
    readMoreAction: {
      cursor: "pointer",
      color: theme.palette.common.blue,
    },
    collapse: {
      [`.${classes.collapsed} &`]: {
        // maskImage: `linear-gradient( to right, transparent, ${theme.palette.common.black} 3%, ${theme.palette.common.black} calc(100% - 3%), transparent), linear-gradient(${theme.palette.common.black}, ${theme.palette.common.black})`,
        // maskSize: "100% 100%",
        maskImage:
          "linear-gradient( to bottom, transparent, #000 0%, #000 calc(100% - 50px), transparent), linear-gradient(#000, #000)",
        maskSize: "100% 100%, 0 100%",
        maskPosition: "0 0, 100% 0",
        maskRepeat: "no-repeat, no-repeat",
      },
    },
    collapsed: {},
  };
});

export default useStyles;
