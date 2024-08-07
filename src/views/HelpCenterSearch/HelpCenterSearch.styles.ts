import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "HelpCenterSearch",
})((theme) => {
  return {
    pagination: {
      marginTop: theme.spacing(2.5),
      display: "flex",
      justifyContent: "flex-end",
      [theme.breakpoints.down("tablet")]: {
        justifyContent: "center",
      },
    },
  };
});

export default useStyles;
