import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDrawerTitleIcon",
})((theme) => {
  return {
    root: {
      "& .MuiIcon-root": {
        fontSize: 20,
      },
      [theme.breakpoints.down("tablet")]: {
        position: "absolute",
        top: "50%",
        transform: "translateY(-50%)",
        marginLeft: 0,
      },
    },
    startIcon: {
      marginRight: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        left: theme.spacing(3),
      },
    },
    endIcon: {
      marginLeft: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        right: theme.spacing(3),
      },
    },
  };
});

export default useStyles;
