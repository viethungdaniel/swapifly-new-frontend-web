import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appListItemIcon",
})((theme) => {
  return {
    root: {
      fontSize: 24,
      color: theme.palette.text.primary,
      marginRight: theme.spacing(1),
      marginLeft: -2,
      "&.MuiListItemIcon-root": {
        minWidth: "initial",
      },
    },
  };
});

export default useStyles;
