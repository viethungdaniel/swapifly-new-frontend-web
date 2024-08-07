import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<void, "desktop">({
  name: "InboxSlug",
})((_, __, classes) => {
  return {
    root: {
      display: "flex",
      flex: 1,
    },
    inboxRelative: {
      position: "relative",
      width: "100%",
      height: "100%",
    },
    inboxRelativeContent: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      display: "flex",
    },
    inboxThreadMessageDrawer: {
      flex: 1,
      overflow: "clip",
    },
    inboxThreadMessageDrawerPaper: {
      width: "100%",
      [`.${classes.desktop} &`]: {
        position: "relative",
        zIndex: 0,
      },
    },
    desktop: {},
  };
});

export default useStyles;
