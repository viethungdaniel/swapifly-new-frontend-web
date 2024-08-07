import { commonHelpers } from "@/utils/helpers";
import { alpha } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

type StylesParams = {
  bgColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
};

const useStyles = makeStyles<
  StylesParams,
  | "outlinedInputRoot"
  | "outlinedInputInput"
  | "outlinedInputNotchedOutline"
  | "outlinedInputFocused"
  | "outlinedInputError"
  | "inputLabel"
>({
  name: "appTextField",
  uniqId: "XjJClS",
})((theme, params, classes) => {
  const bgColor =
    _get(theme.palette, params.bgColor!) || (params.bgColor as string);
  const borderColor =
    _get(theme.palette, params.borderColor!) ||
    (params.borderColor as string) ||
    theme.palette.common.lightNeutral;
  const hoverBorderColor =
    _get(theme.palette, params.hoverBorderColor!) ||
    (params.hoverBorderColor as string) ||
    theme.palette.primary.main;

  return {
    outlinedInputRoot: {
      margin: 0,
      "& .MuiInputAdornment-root": {
        fontSize: 24,
        color: theme.palette.common.darkNeutral,
      },
      "& .MuiInputAdornment-positionStart, & .MuiInputAdornment-positionEnd": {
        "& .MuiButtonBase-root": {
          height: 40,
          padding: theme.spacing(2),
          [`& .${commonHelpers.generateClassName("button", "startIcon")}`]: {
            marginLeft: `calc(-${theme.spacing(2)}/2 + 2px)`,
          },
          [`& .${commonHelpers.generateClassName("button", "endIcon")}`]: {
            marginRight: `calc(-${theme.spacing(2)}/2 + 2px)`,
          },

          [`&.${commonHelpers.generateClassName(
            "button",
            "textEdgeX"
          )},&.${commonHelpers.generateClassName(
            "button",
            "textEdgeXY"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedEdgeX"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedEdgeXY"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedTonalEdgeX"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedTonalEdgeXY"
          )},&.${commonHelpers.generateClassName(
            "button",
            "outlinedEdgeX"
          )},&.${commonHelpers.generateClassName("button", "outlinedEdgeXY")}`]:
            {
              marginLeft: `-${theme.spacing(2)}`,
              marginRight: `-${theme.spacing(2)}`,
            },

          [`&.${commonHelpers.generateClassName(
            "button",
            "textEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedTonalEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "button",
            "outlinedEdgeStart"
          )}`]: {
            marginLeft: `-${theme.spacing(2)}`,
          },

          [`&.${commonHelpers.generateClassName(
            "button",
            "textEdgeEnd"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedEdgeEnd"
          )},&.${commonHelpers.generateClassName(
            "button",
            "containedTonalEdgeEnd"
          )},&.${commonHelpers.generateClassName(
            "button",
            "outlinedEdgeEnd"
          )}`]: {
            marginRight: `-${theme.spacing(2)}`,
          },
        },

        [`& .${commonHelpers.generateClassName("iconButton", "root")}`]: {
          width: 40,
          padding: theme.spacing(1),
          [`&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeX"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeXY"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedEdgeX"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedEdgeXY"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedTonalEdgeX"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedTonalEdgeXY"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "outlinedEdgeX"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "outlinedEdgeXY"
          )}`]: {
            marginLeft: `-${theme.spacing(2)}`,
            marginRight: `-${theme.spacing(2)}`,
          },

          [`&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedTonalEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "outlinedEdgeStart"
          )}`]: {
            marginLeft: `-${theme.spacing(2)}`,
          },

          [`&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeEnd"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedEdgeEnd"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "containedTonalEdgeEnd"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "outlinedEdgeEnd"
          )}`]: {
            marginRight: `-${theme.spacing(2)}`,
          },
        },
      },
      [`.${classes.inputLabel} + &`]: {
        marginTop: `calc(${theme.spacing(0.5)} + 21px)`,
      },
      "&:hover": {
        [`& .${classes.outlinedInputNotchedOutline}`]: {
          borderColor: hoverBorderColor,
        },
        [`&.${classes.outlinedInputError} .${classes.outlinedInputNotchedOutline}`]:
          {
            borderColor: theme.palette.error.main,
          },
      },
      [`&.${classes.outlinedInputFocused}`]: {
        [`& .${classes.outlinedInputNotchedOutline}`]: {
          borderColor: hoverBorderColor,
        },
        [`&.${classes.outlinedInputError} .${classes.outlinedInputNotchedOutline}`]:
          {
            borderColor: theme.palette.error.main,
          },
      },
    },
    outlinedInputInput: {
      ...theme.typography.bodyReg14,
      padding: theme.spacing("9.5px", 2),
      minHeight: 21,
      color: theme.palette.text.primary,
      "&:autofill, &:autofill:hover, &:autofill:focus, &:autofill:active": {
        transition: "background-color 9999s ease-in-out 0s",
      },
      "&::placeholder": {
        color: theme.palette.common.neutral,
      },
    },
    outlinedInputMultiline: {
      padding: theme.spacing("9.5px", 2),
      [`& .${classes.outlinedInputInput}`]: {
        padding: 0,
      },
    },
    outlinedInputFocused: {},
    outlinedInputNotchedOutline: {
      borderColor,
    },
    outlinedInputDisabled: {
      ":not(input)": {
        backgroundColor: alpha(
          theme.palette.common.lighterNeutral,
          theme.palette.action.disabledOpacity
        ),
      },
    },
    outlinedInputAdornedStart: {
      paddingLeft: theme.spacing(2),
    },
    outlinedInputInputAdornedStart: {
      [`.${classes.outlinedInputRoot} &`]: {
        paddingLeft: theme.spacing(0),
      },
    },
    outlinedInputAdornedEnd: {
      paddingRight: theme.spacing(2),
    },
    outlinedInputInputAdornedEnd: {
      [`.${classes.outlinedInputRoot} &`]: {
        paddingRight: theme.spacing(0),
      },
    },
    outlinedInputError: {},
    outlinedInputBg: {
      backgroundColor: bgColor,
    },
    formHelperText: {
      paddingLeft: theme.spacing(0.75),
    },
    inputLabel: {
      maxWidth: "100%",
      paddingLeft: theme.spacing(0.75),
    },
    borderRadiusCircular: {
      borderRadius: "50px",
    },
  };
});

export default useStyles;
