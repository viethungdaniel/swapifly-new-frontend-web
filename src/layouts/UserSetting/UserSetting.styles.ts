import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "UserSetting",
})((theme) => {
  return {
    content: {
      paddingTop: theme.spacing(1.25),
      display: "flex",
      backgroundColor: theme.palette.background.default,
      minHeight: "calc(100vh - 150px)",
      [theme.breakpoints.down("tablet")]: {
        minHeight: "calc(100vh - 160px)",
      },
    },
    setting: {
      width: 300,
    },
    settingItem: {
      minHeight: 60,
    },
    dividerVertical: {
      marginTop: theme.spacing(-1.25),
      height: `calc(100% + ${theme.spacing(-1.25)})`,
    },
    main: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
    },
  };
});

export default useStyles;
