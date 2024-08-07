import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "SlugProductCategory",
})((theme) => {
  return {
    main: {
      display: "flex",
      flexDirection: "column",
    },
    productFilterBar: {
      padding: theme.spacing(2.5, 0),
    },
    content: {
      display: "flex",
      flexDirection: "column",
      gap: theme.spacing(3.75),
    },
    actions: {
      marginTop: theme.spacing(3.75),
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
    },
  };
});

export default useStyles;
