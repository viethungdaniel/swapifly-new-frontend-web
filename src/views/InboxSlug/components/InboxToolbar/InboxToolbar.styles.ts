import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "InboxToolbar",
})((theme) => {
  return {
    root: {
      borderBottom: `1px solid ${theme.palette.divider}`,
      position: "sticky",
      top: 0,
      backgroundColor: theme.palette.common.white,
      zIndex: 1,
    },
  };
});

export default useStyles;
