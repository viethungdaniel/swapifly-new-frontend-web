import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDialog",
})((theme) => {
  return {
    scrollBody: {
      scrollBehavior: "smooth",
    },
    paperFullScreen: {
      [theme.breakpoints.down("tablet")]: {
        backgroundColor: theme.palette.common.lightestNeutral,
      },
    },
  };
});

export default useStyles;
