import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppPaperContent",
})((theme) => {
  return {
    root: {
      padding: theme.spacing(2.5),
      [theme.breakpoints.down("sm")]: {
        padding: theme.spacing(
          `${theme.app.spacings.guttersSmall}px`,
          `${theme.app.spacings.guttersSmall}px`
        ),
      },
    },
  };
});

export default useStyles;
