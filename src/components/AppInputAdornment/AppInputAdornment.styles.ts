import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appInputAdornment",
})((theme) => {
  return {
    positionStart: {
      marginRight: theme.spacing(2),
    },
    positionEnd: {
      marginLeft: theme.spacing(2),
    },
  };
});

export default useStyles;
