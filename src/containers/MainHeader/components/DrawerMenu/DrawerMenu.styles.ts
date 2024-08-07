import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "DrawerMenu",
})((theme) => {
  return {
    drawerPaper: {
      width: `calc(${theme.breakpoints.values.sm}px - ${theme.spacing(2)})`,
      maxWidth: `calc(100vw - ${theme.spacing(68 / 8)})`,
    },
    user: {
      backgroundColor: theme.palette.common.lighterNeutral,
      justifyContent: "flex-start",
      textAlign: "start",
      height: "auto",
      gap: theme.spacing(2.5),
    },
    userAvatarWrapper: {
      position: "relative",
      display: "flex",
    },
    userAvatar: {
      width: 34,
      height: 34,
    },
    merchantCircularTagSvg: {
      position: "absolute",
      top: 0,
      left: 0,
      pointerEvents: "none",
      zIndex: 1,
      width: "100%",
      height: "100%",
    },
    userContent: {
      flex: 1,
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
      overflow: "hidden",
    },
    menuList: {
      flex: 1,
    },
    menuItemGutters: {
      paddingTop: theme.spacing(2.5),
      paddingBottom: theme.spacing(2.5),
      textTransform: "capitalize",
    },
  };
});

export default useStyles;
