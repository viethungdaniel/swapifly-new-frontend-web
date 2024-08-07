import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppTab",
})((theme) => {
  return {
    root: {
      minHeight: 60,
      minWidth: 90 + 12,
      padding: theme.spacing(1.5, 3.5),
      color: theme.palette.text.secondary,
      ...theme.typography.bodyReg14,
    },
    selected: {
      ...theme.typography.bodyMed14,
    },
  };
});

export default useStyles;
