import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "Portal",
})((theme) => {
  return {
    root: {
      display: "flex",
      flexDirection: "column",
      backgroundColor: theme.palette.background.default,
      minHeight: "100vh",
    },
    main: {
      flexGrow: 1,
      display: "flex",
      flexDirection: "column",
      width: "100%",
      minHeight: "calc(100vh - 80px)",
    },
  };
});

export default useStyles;
