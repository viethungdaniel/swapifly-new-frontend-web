import theme from "@/assets/theme";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "settingMenuDrawer",
})(() => {
  return {
    menuItemGutters: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
    },
  };
});

export default useStyles;
