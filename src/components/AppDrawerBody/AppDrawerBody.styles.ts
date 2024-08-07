import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDrawerBody",
})((theme) => {
  return {
    root: {
      flex: 1,
      backgroundColor: theme.palette.common.lightestNeutral,
    },
    padding: {
      padding: theme.spacing(3),
      [theme.breakpoints.down("sm")]: {
        paddingLeft: theme.spacing(2),
        paddingRight: theme.spacing(2),
      },
    },
  };
});

export default useStyles;
