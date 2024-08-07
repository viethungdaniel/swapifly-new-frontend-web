import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles({
  name: "appTextFieldGroup",
})((theme) => {
  return {
    root: {
      display: "flex",
      "& .MuiInputBase-root": {
        position: "relative",
        "&:before": {
          content: '""',
          position: "absolute",
          top: "50%",
          left: -1 / 2,
          transform: "translateY(-50%)",
          width: 1,
          height: "calc(100% - 9.5px*2)",
          backgroundColor: theme.palette.common.lightNeutral,
        },
        "&:after": {
          content: '""',
          position: "absolute",
          top: "50%",
          right: -1 / 2,
          transform: "translateY(-50%)",
          width: 1,
          height: "calc(100% - 9.5px*2)",
          backgroundColor: theme.palette.common.lightNeutral,
        },
        "&:hover": {
          "&:before, &:after": {
            zIndex: 1,
            backgroundColor: theme.palette.primary.main,
          },
        },
        "&.Mui-focused": {
          "&:before, &:after": {
            zIndex: 2,
            width: 2,
            right: -1,
            backgroundColor: theme.palette.primary.main,
          },
        },
        "&.Mui-error": {
          "&:before, &:after": {
            zIndex: 2,
            backgroundColor: theme.palette.error.main,
          },
        },
      },
      "& > .MuiFormControl-root, & > .MuiInputBase-root": {
        position: "relative",
        "& .MuiOutlinedInput-notchedOutline": {
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
          borderBottomLeftRadius: 0,
          borderBottomRightRadius: 0,
          borderLeftWidth: 0,
          borderRightWidth: 0,
        },
        "&:first-of-type": {
          "&.MuiInputBase-root:before, & .MuiInputBase-root:before": {
            width: 0,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderTopLeftRadius: theme.shape.borderRadius,
            borderBottomLeftRadius: theme.shape.borderRadius,
            borderLeftWidth: 1,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline, & .Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderLeftWidth: 2,
            },
        },
        "&:last-of-type": {
          "&.MuiInputBase-root:after, & .MuiInputBase-root:after": {
            width: 0,
          },
          "& .MuiOutlinedInput-notchedOutline": {
            borderTopRightRadius: theme.shape.borderRadius,
            borderBottomRightRadius: theme.shape.borderRadius,
            borderRightWidth: 1,
          },
          "&.Mui-focused .MuiOutlinedInput-notchedOutline, & .Mui-focused .MuiOutlinedInput-notchedOutline":
            {
              borderRightWidth: 2,
            },
        },
      },
    },
    borderRadiusCircular: {
      "& > .MuiFormControl-root, & > .MuiInputBase-root": {
        "&:first-of-type .MuiOutlinedInput-notchedOutline": {
          borderTopLeftRadius: 50,
          borderBottomLeftRadius: 50,
        },
        "&:last-of-type .MuiOutlinedInput-notchedOutline": {
          borderTopRightRadius: 50,
          borderBottomRightRadius: 50,
        },
      },
    },
    fullWidth: {
      width: "100%",
      "& > .MuiFormControl-root, & > .MuiInputBase-root": {
        width: "100%",
      },
    },
  };
});

export default useStyles;
