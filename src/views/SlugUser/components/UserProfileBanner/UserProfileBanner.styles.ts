import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "UserProfileBanner",
})(() => {
  return {
    root: {},
    banner: {
      position: "relative",
      width: "100%",
      paddingTop: "calc(100%*25/100)",
    },
    bannerImage: {
      objectFit: "cover",
      objectPosition: "center",
    },
    hasBanner: {
      cursor: "pointer",
    },
  };
});

export default useStyles;
