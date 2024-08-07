import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "HtmlParser",
})((theme) => {
  return {
    root: {
      whiteSpace: "normal",
      "& p, ul, table, pre": {
        marginTop: theme.spacing(3),
        marginBottom: 0,
      },
      "& h1, h2, h3, h4, h5, h6": {
        marginTop: theme.spacing(5),
        marginBottom: 0,
        // color: theme.palette.text.primary,
        "& + p, ul, table, pre": {
          marginTop: theme.spacing(2),
        },
      },
      // "& p, a, blockquote": {
      //   ...theme.typography.nunitoSemiBold16,
      // },
      "& p, li, ": {
        // color: theme.palette.common.blackGrey,
      },
      "& ul": {
        "& li": {
          marginBottom: theme.spacing(1),
        },
      },
      "& code": {
        backgroundColor: theme.palette.grey[200],
        padding: theme.spacing(0.25, 0.5),
        // color: theme.palette.common.black,
      },
      "& pre code": {
        backgroundColor: "transparent",
        color: theme.palette.text.secondary,
      },
      "& blockquote": {
        backgroundColor: theme.palette.common.lightNeutral,
        padding: theme.spacing(3, 4.25),
        marginLeft: 0,
        marginRight: 0,
        position: "relative",
        "&:after": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          width: 4,
          height: "100%",
          backgroundColor: theme.palette.primary.main,
        },
      },
      "& pre": {
        padding: theme.spacing(3),
        backgroundColor: theme.palette.grey[100],
        border: `1px solid ${theme.palette.primary.main}`,
        overflow: "auto",
        "& code": {},
      },

      "& img": {
        maxWidth: "100%",
        objectFit: "cover",
      },
      table: {
        td: {
          textAlign: "center",
        },
      },
      "& *": {
        maxWidth: "100%",
      },
    },
    clearMarginTop: {
      "& + *": {
        marginTop: "0px !important",
      },
    },
  };
});

export default useStyles;
