import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "DatesFormField",
})((theme) => {
  return {
    root: {},
    dateCalendar: {
      maxWidth: "100%",
      marginTop: theme.spacing(0.5),
      backgroundColor: theme.palette.common.lightNeutral,
    },
    dateList: {
      marginTop: theme.spacing(1.25),
      display: "flex",
      flexWrap: "wrap",
      gap: theme.spacing(1),
    },
  };
});

export default useStyles;
