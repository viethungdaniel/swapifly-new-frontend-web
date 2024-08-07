import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appListSubheader",
})((theme) => {
  return {
    root: {
      lineHeight: "40px",
    },
    gutters: {
      paddingLeft: theme.spacing(2.5),
      paddingRight: theme.spacing(2.5),
    },
  };
});

export default useStyles;
