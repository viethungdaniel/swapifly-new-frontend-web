import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SlugProduct",
})((theme) => {
  return {
    breadcrumbsContainer: {
      marginBottom: theme.spacing(2.5),
    },
    productGalleryContainer: {
      marginBottom: theme.spacing(2.5),
    },
    similarProductList: {
      marginTop: theme.spacing(2.5),
    },
    disabledPage: {
      pointerEvents: "none",
    },
  };
});

export default useStyles;
