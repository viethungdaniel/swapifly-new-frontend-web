import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "mainFooter",
})((theme) => {
  return {
    socialMedia: {
      paddingTop: theme.spacing(1.25),
    },
    socialMediaTitle: {
      marginBottom: theme.spacing(1.25),
      [theme.breakpoints.down("tablet")]: {
        marginBottom: theme.spacing(2),
      },
    },
    socialMediaList: {
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(1.25),
    },
  };
});

export default useStyles;
