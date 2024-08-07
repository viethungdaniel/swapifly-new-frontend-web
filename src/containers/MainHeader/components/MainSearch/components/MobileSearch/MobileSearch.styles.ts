import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "mobileSearch",
})((theme) => {
  return {
    searchTextField: {
      backgroundColor: theme.palette.common.lighterNeutral,
    },
    drawerTitle: {
      gap: theme.spacing(2.5),
    },
    optionMenuIcon: {
      fontSize: 24,
      color: theme.palette.text.primary,
    },
    optionMenuClear: {
      display: "flex",
      padding: theme.spacing(0.5),
      margin: theme.spacing(-0.5),
      color: theme.palette.text.primary,
      "&:hover": {
        color: theme.palette.primary.main,
      },
    },
    optionMenuClearIcon: {
      color: "inherit",
      fontSize: 14,
    },
  };
});

export default useStyles;
