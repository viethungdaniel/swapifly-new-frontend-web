import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appPosition",
})((theme) => {
  return {
    root: {
      zIndex: 1,
    },
    gutterSmall: {
      margin: theme.spacing(1.25),
      maxWidth: `calc(100% - ${theme.spacing(1.25)}*2)`,
    },
    gutterMedium: {
      margin: theme.spacing(2.5),
      maxWidth: `calc(100% - ${theme.spacing(2.5)}*2)`,
    },
    gutterLarge: {
      margin: theme.spacing(3.75),
      maxWidth: `calc(100% - ${theme.spacing(3.75)}*2)`,
    },
    fullWidth: {
      width: "100%",
    },
    relative: {
      position: "relative",
    },
    absolute: {
      position: "absolute",
    },
    fixed: {
      position: "fixed",
    },
    sticky: {
      position: "sticky",
    },

    cover: {
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
    },

    bottom: {
      bottom: 0,
      left: "50%",
      transform: "translateX(-50%)",
    },
    bottomStart: {
      bottom: 0,
      left: 0,
    },
    bottomEnd: {
      bottom: 0,
      right: 0,
    },

    top: {
      top: 0,
      left: "50%",
      transform: "translateX(-50%)",
    },
    topStart: {
      top: 0,
      left: 0,
    },
    topEnd: {
      top: 0,
      right: 0,
    },

    left: {
      top: "50%",
      left: 0,
      transform: "translateY(-50%)",
    },
    leftStart: {
      top: 0,
      left: 0,
    },
    leftEnd: {
      bottom: 0,
      left: 0,
    },

    right: {
      top: "50%",
      right: 0,
      transform: "translateY(-50%)",
    },
    rightStart: {
      top: 0,
      right: 0,
    },
    rightEnd: {
      bottom: 0,
      right: 0,
    },
  };
});

export default useStyles;
