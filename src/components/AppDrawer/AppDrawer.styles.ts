import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appDrawer",
})((theme) => {
  const drawerWidth = theme.breakpoints.values.sm;

  return {
    paper: {
      borderRadius: 0,
    },
    paperAnchorRight: {
      width: drawerWidth,
      maxWidth: "100%",
    },
  };
});

export default useStyles;
