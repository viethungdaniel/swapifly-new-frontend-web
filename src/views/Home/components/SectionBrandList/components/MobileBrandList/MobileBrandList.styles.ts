import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "mobileBrandList",
})((theme) => {
  return {
    brandItem: {
      width: 70,
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(0.5),
    },
    brandItemLogo: {
      position: "relative",
      height: 70,
      backgroundColor: theme.palette.common.lighterNeutral,
      borderRadius: "50%",
      overflow: "hidden",
    },
    brandItemTitle: {
      width: "100%",
      overflow: "hidden",
      wordWrap: "break-word",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
    },
  };
});

export default useStyles;
