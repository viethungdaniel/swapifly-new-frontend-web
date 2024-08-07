import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "AppPaper",
})((theme) => {
  return {
    root: {
      backgroundColor: theme.palette.common.white,
    },
    boxShadowMenuPopper: {
      boxShadow: "0px 8px 24px -4px rgba(27, 46, 94, 0.12)",
    },
    boxShadowCard: {
      boxShadow: "0px 8px 24px -4px rgba(27, 46, 94, 0.08)",
    },
  };
});

export default useStyles;
