import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppSelectMenuItem",
})((theme) => {
  return {
    selected: {
      color: theme.palette.primary.main,
      fontSize: theme.typography.bodyMed14.fontSize,
      fontWeight: theme.typography.bodyMed14.fontWeight,
      fontFamily: theme.typography.bodyMed14.fontFamily,
      gap: theme.spacing(1),
    },
  };
});

export default useStyles;
