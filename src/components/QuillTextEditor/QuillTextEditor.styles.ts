import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "QuillTextEditor",
  uniqId: "wskHRY",
})((theme) => {
  return {
    root: {
      border: `1px solid ${theme.palette.divider}`,
      borderRadius: theme.shape.borderRadius,
      "& .ql-toolbar": {
        border: "initial",
        padding: theme.spacing(1, 2),
        paddingBottom: 0,
      },
    },
    quill: {
      "& .ql-container": {
        border: "initial",
        "& .ql-editor": {
          padding: theme.spacing("10.78px", 2),
        },
      },
    },
    toolbar: {},
  };
});

export default useStyles;
