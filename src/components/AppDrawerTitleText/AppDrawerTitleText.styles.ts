import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDrawerTitleText",
})((theme) => {
  return {
    root: {
      flex: 1,
      [theme.breakpoints.down("tablet")]: {
        textAlign: "center",
        maxWidth: `calc(100% - ${24 * 2}px - ${theme.spacing(1.25 * 4)})`,
      },
    },
  };
});

export default useStyles;
