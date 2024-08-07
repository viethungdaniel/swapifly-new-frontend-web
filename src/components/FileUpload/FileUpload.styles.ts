import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<
  void,
  "loading" | "disabled" | "error" | "inputLabel"
>({
  name: "FileUpload",
  uniqId: "mtML1R",
})((theme, _, classes) => {
  return {
    root: {},
    inputLabel: {
      marginTop: 0,
      marginBottom: theme.spacing(0.5),
    },
    outlinedUpload: {
      position: "relative",
      width: "100%",
      minHeight: 120,
      borderRadius: theme.shape.borderRadius,
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(0.5),
      textAlign: "center",
      cursor: "pointer",
      padding: theme.spacing(1.25, 2),
      color: theme.palette.common.blue,
      backgroundColor: theme.palette.common.white,
      "&:before": {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        borderRadius: theme.shape.borderRadius,
        border: `1px dashed ${theme.palette.common.blue}`,
        [`.${classes.disabled} &`]: {
          borderColor: theme.palette.text.disabled,
        },
        [`.${classes.error} &`]: {
          borderColor: theme.palette.error.main,
        },
      },
      "&:hover": {
        "&:before": {
          borderWidth: 2,
          [`.${classes.disabled} &`]: {
            borderWidth: 1,
          },
        },
      },
      [`.${classes.disabled} &`]: {
        cursor: "auto",
      },
    },
    outlinedUploadDragOver: {
      "&:before": {
        borderWidth: 2,
      },
    },
    outlinedUploadInput: {
      display: "none",
    },
    outlinedUploadLabel: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      gap: theme.spacing(1.25),
      color: theme.palette.primary.main,
    },
    outlinedUploadIcon: {
      fontSize: 24,
      color: "inherit",
    },
    fileItem: {
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      gap: theme.spacing(0.5),
    },
    fileItemToolbar: {
      position: "absolute",
      top: 0,
      right: 0,
      zIndex: 2,
      display: "flex",
      justifyContent: "flex-end",
      // gap: theme.spacing(1),
      width: "100%",
    },
    fileItemBottomToolbar: {
      position: "absolute",
      left: "50%",
      bottom: 0,
      zIndex: 2,
      translate: "-50% 0%",
      width: "100%",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
    },
    fileItemLoadingLinearProgress: {
      marginBottom: theme.spacing(1),
      borderRadius: 6,
      height: 6,
      width: "calc(100% - 16px)",
    },
    fileItemThumbnail: {
      position: "relative",
      paddingTop: "100%",
      width: "100%",
      borderRadius: 4,
      overflow: "clip",
      border: `1px solid ${theme.palette.text.primary}`,
      backgroundColor: theme.palette.common.lighterNeutral,
      [`.${classes.loading} &`]: {
        "&:before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          zIndex: 1,
          width: "100%",
          height: "100%",
          backgroundColor: `rgba(255,255,255, ${theme.palette.action.disabledOpacity})`,
        },
      },
    },
    fileListItemCloseIcon: {
      fontSize: 20,
      color: "inherit",
    },
    fileItemPlayIcon: {
      position: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 2,
      translate: "-50% -50%",
      color: theme.palette.common.neutral,
      fontSize: 32,
    },
    fileItemFileSvg: {
      position: "absolute",
      top: "50%",
      left: "50%",
      zIndex: 2,
      translate: "-50% -50%",
      color: theme.palette.common.neutral,
      height: 120 - 32 * 2,
    },
    fileItemLabel: {
      maxWidth: "100%",
      overflow: "hidden",
      display: "-webkit-box",
      WebkitLineClamp: 2,
      WebkitBoxOrient: "vertical",
      padding: theme.spacing(0, 1 / 2),
    },
    fileItemTag: {
      width: "100%",
      textAlign: "center",
      backgroundColor: theme.palette.common.darkNeutral,
      color: theme.palette.common.white,
      padding: theme.spacing(0, 1),
    },
    disabled: {},
    error: {},
    loading: {},
  };
});

export default useStyles;
