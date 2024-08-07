import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "PortalNewsHeader",
})((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.common.blue,
      color: theme.palette.common.white,
    },
    content: {
      paddingTop: theme.spacing(5),
      paddingBottom: theme.spacing(5),
      display: "flex",
      justifyContent: "space-between",
    },
    search: {
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    },
    searchInput: {
      width: 480,
      maxWidth: "100%",
      [theme.breakpoints.down("tablet")]: {
        width: "100%",
      },
    },
    newsSvg: {
      height: 150,
      [theme.breakpoints.down("tablet")]: {
        display: "none",
      },
    },
  };
});

export default useStyles;
