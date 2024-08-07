import { commonHelpers } from "@/utils/helpers";
import { makeStyles } from "tss-react/mui";
import _get from "lodash/get";

type StylesParams = {
  bgColor?: string;
  borderColor?: string;
  hoverBorderColor?: string;
};

const useStyles = makeStyles<StylesParams, "inputLabel" | "root">({
  name: "AppSelect",
  uniqId: "LQ8mIG",
})((theme, params) => {
  const keyToBgColorMap = {
    transparent: "transparent",
    white: theme.palette.common.white,
  };

  const bgColor =
    keyToBgColorMap[params.bgColor! as keyof typeof keyToBgColorMap] ||
    (_get(theme.palette, params?.bgColor!) as string) ||
    params?.bgColor ||
    "transparent";

  const borderColor =
    _get(theme.palette, params.borderColor!) ||
    (params.borderColor as string) ||
    theme.palette.common.lightNeutral;
  const hoverBorderColor =
    _get(theme.palette, params.hoverBorderColor!) ||
    (params.hoverBorderColor as string) ||
    theme.palette.primary.main;

  return {
    selectBgColor: {
      backgroundColor: bgColor,
    },
    placeholder: {
      color: theme.palette.common.neutral,
      opacity: 0.42,
    },
    borderRadiusCircular: {
      borderRadius: 50,
      "& .MuiOutlinedInput-notchedOutline": {
        borderRadius: 50,
      },
    },
    root: {
      "& .MuiInputAdornment-root": {
        fontSize: 20,
        color: theme.palette.common.darkNeutral,
      },
      "& .MuiInputAdornment-positionEnd, & .MuiInputAdornment-positionStart": {
        [`& .${commonHelpers.generateClassName("button", "textSizeMedium")}`]: {
          [`&.${commonHelpers.generateClassName(
            "button",
            "textEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "button",
            "textEdgeEnd"
          )},&.${commonHelpers.generateClassName("button", "textEdgeX")}`]: {
            paddingLeft: theme.spacing(2),
            paddingRight: theme.spacing(2),
          },
          [`&.${commonHelpers.generateClassName("button", "textEdgeX")}`]: {
            marginLeft: `-${theme.spacing(2)}`,
            marginRight: `-${theme.spacing(2)}`,
          },
          [`&.${commonHelpers.generateClassName("button", "textEdgeStart")}`]: {
            marginLeft: `-${theme.spacing(2)}`,
          },
          [`&.${commonHelpers.generateClassName("button", "textEdgeEnd")}`]: {
            marginRight: `-${theme.spacing(2)}`,
          },
        },

        [`& .${commonHelpers.generateClassName(
          "iconButton",
          "textSizeMedium"
        )}`]: {
          [`&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeStart"
          )},&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeEnd"
          )},&.${commonHelpers.generateClassName("iconButton", "textEdgeX")}`]:
            {
              padding: theme.spacing(1),
            },
          [`&.${commonHelpers.generateClassName("iconButton", "textEdgeX")}`]: {
            marginRight: `-${theme.spacing(2)}`,
          },
          [`&.${commonHelpers.generateClassName(
            "iconButton",
            "textEdgeStart"
          )}`]: {
            marginRight: `-${theme.spacing(2)}`,
          },
          [`&.${commonHelpers.generateClassName("iconButton", "textEdgeEnd")}`]:
            {
              marginRight: `-${theme.spacing(2)}`,
            },
        },
      },

      "& .MuiSelect-select, & .MuiNativeSelect-select": {
        fontSize: theme.typography.bodyReg14.fontSize,
        fontWeight: theme.typography.bodyReg14.fontWeight,
        lineHeight: theme.typography.bodyReg14.lineHeight,
        fontFamily: theme.typography.bodyReg14.fontFamily,
        padding: theme.spacing("9.5px", 2),
        color: theme.palette.text.primary,
        "&.MuiInputBase-input": {
          paddingRight: 32 + 10,
        },
      },
      "& .MuiOutlinedInput-notchedOutline": {
        borderColor,
      },
      "&.Mui-error .MuiOutlinedInput-notchedOutline": {
        borderColor: theme.palette.error.main,
      },

      [`& .MuiSelect-select option[value=""], & .MuiSelect-select option:not([value])`]:
        {
          color: "red",
        },
      [`& .MuiSelect-select:empty`]: {
        background: "red",
      },

      "&.MuiInputBase-adornedStart": {
        paddingLeft: theme.spacing(2),
      },
      "& .MuiInputBase-inputAdornedStart": {
        paddingLeft: theme.spacing(0),
      },
      "&.MuiInputBase-adornedEnd": {
        paddingRight: `calc(${theme.spacing(2)} + 20px + ${theme.spacing(
          1.25
        )})`,
      },
      "& .MuiInputBase-inputAdornedEnd": {
        [`&.MuiSelect-select`]: {
          paddingRight: theme.spacing(0),
        },
      },

      "& .MuiNativeSelect-icon, & .MuiSelect-icon": {
        fontSize: 20,
        color: theme.palette.common.black,
        right: theme.spacing(2),
        transition: theme.transitions.create(["transform"]),
      },

      "&:hover": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: hoverBorderColor,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.error.main,
        },
      },
      "& .Mui-focused": {
        "& .MuiOutlinedInput-notchedOutline": {
          borderColor: hoverBorderColor,
        },
        "&.Mui-error .MuiOutlinedInput-notchedOutline": {
          borderColor: theme.palette.error.main,
        },
      },
    },

    selectMenuPaper: {
      // maxHeight: `calc(${40 * 5}px + ${theme.spacing(1.25 * 2)})`,
      maxHeight: "40dvh",
      overflow: "auto",
      boxShadow: "0px 8px 24px -4px rgba(27, 46, 94, 0.08)",
    },
    selectMenuList: {
      paddingTop: `${theme.spacing(1.25)} !important`,
      paddingBottom: `${theme.spacing(1.25)} !important`,
    },

    inputLabel: {
      maxWidth: "100%",
      paddingLeft: theme.spacing(0.75),
      "& + .MuiOutlinedInput-root": {
        marginTop: `calc(${theme.spacing(0.5)} + 21px)`,
      },
    },
    formHelperText: {
      paddingLeft: theme.spacing(0.75),
    },
  };
});

export default useStyles;
