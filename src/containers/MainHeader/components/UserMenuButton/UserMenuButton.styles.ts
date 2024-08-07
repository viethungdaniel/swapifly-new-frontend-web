import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "UserMenuButton",
})(() => {
  return {
    menuList: {
      minWidth: 240,
    },
    userAvatar: {
      position: "relative",
      width: 32,
      height: 32,
      marginLeft: -0.75,
    },
    merchantCircularTagSvg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
    },
  };
});

export default useStyles;
