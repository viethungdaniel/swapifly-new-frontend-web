import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "weekdayItemButton">({
  name: "WeekdaysFormField",
  uniqId: "O4Ku5c",
})((theme, _, classes) => {
  return {
    weekdayList: {
      display: "flex",
      justifyContent: "space-between",
      gap: theme.spacing(1.25),
      marginTop: theme.spacing(1.25),
      [theme.breakpoints.down(40 * 7 + 10 * 6 + 16 * 2)]: {
        justifyContent: "center",
        flexWrap: "wrap",
        [`& .${classes.weekdayItemButton}`]: {
          maxWidth: 50,
        },
      },
    },
    weekdayItemButton: {
      flex: 1,
      maxWidth: `calc(100%/7 - ${theme.spacing(1.25)})`,
      paddingLeft: theme.spacing(1.25),
      paddingRight: theme.spacing(1.25),
    },
  };
});

export default useStyles;
