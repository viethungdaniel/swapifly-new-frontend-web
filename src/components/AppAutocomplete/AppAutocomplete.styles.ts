import { commonHelpers } from "@/utils/helpers";
import { alpha, darken } from "@mui/material/styles";
import { makeStyles } from "tss-react/mui";

const useStyles = makeStyles<
  void,
  "input" | "root" | "hasClearIcon" | "hasPopupIcon" | "endAdornment"
>({
  name: "appAutocomplete",
  uniqId: "CTmsfJ",
})((theme, _, classes) => {
  return {
    root: {
      [`&  .MuiOutlinedInput-root .${classes.endAdornment}`]: {
        right: theme.spacing(2),
      },
      [`& .MuiOutlinedInput-root`]: {
        padding: `5px ${theme.spacing(1)}`,
        "& .MuiAutocomplete-input": {
          padding: `4.5px ${theme.spacing(1)} 4.5px ${theme.spacing(1)}`,
          "&.MuiInputBase-inputAdornedEnd": {
            paddingRight: 0,
          },
          "&.MuiInputBase-inputAdornedStart": {
            paddingLeft: 0,
          },
        },
        "& .MuiInputAdornment-positionStart": {
          marginLeft: theme.spacing(1),
          [`& .${commonHelpers.generateClassName("button", "textSizeMedium")}`]:
            {
              [`&.${commonHelpers.generateClassName(
                "button",
                "textEdgeStart"
              )},&.${commonHelpers.generateClassName(
                "button",
                "textEdgeEnd"
              )},&.${commonHelpers.generateClassName("button", "textEdgeX")}`]:
                {
                  paddingLeft: theme.spacing(2),
                  paddingRight: theme.spacing(2),
                  marginLeft: `-${theme.spacing(1)}`,
                },
              [`&.${commonHelpers.generateClassName("button", "textEdgeX")}`]: {
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
            )},&.${commonHelpers.generateClassName(
              "iconButton",
              "textEdgeX"
            )}`]: {
              marginLeft: `-${theme.spacing(1)}`,
            },
            [`&.${commonHelpers.generateClassName("iconButton", "textEdgeX")}`]:
              {
                marginRight: `-${theme.spacing(1)}`,
              },
          },
        },
        "& .MuiInputAdornment-positionEnd": {
          [`& .${commonHelpers.generateClassName("button", "textSizeMedium")}`]:
            {
              [`&.${commonHelpers.generateClassName(
                "button",
                "textEdgeStart"
              )},&.${commonHelpers.generateClassName(
                "button",
                "textEdgeEnd"
              )},&.${commonHelpers.generateClassName("button", "textEdgeX")}`]:
                {
                  paddingLeft: theme.spacing(2),
                  paddingRight: theme.spacing(2),
                  marginRight: `-${theme.spacing(1)}`,
                },
              [`&.${commonHelpers.generateClassName("button", "textEdgeX")}`]: {
                marginLeft: `-${theme.spacing(2)}`,
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
            )},&.${commonHelpers.generateClassName(
              "iconButton",
              "textEdgeX"
            )}`]: {
              marginLeft: `-${theme.spacing(1)}`,
            },
            [`&.${commonHelpers.generateClassName("iconButton", "textEdgeX")}`]:
              {
                marginRight: `-${theme.spacing(1)}`,
              },
          },
        },
      },
    },
    input: {},
    option: {
      flex: 1,
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start",
      overflow: "auto",
    },
    listbox: {
      // paddingTop: theme.spacing(1.25),
      // paddingBottom: theme.spacing(1.25),
      "& .MuiAutocomplete-option": {
        padding: theme.spacing(1.25, 2.5),
        position: "relative",
        minHeight: 50,
        // "&:after": {
        //   content: '""',
        //   position: "absolute",
        //   bottom: 0,
        //   left: "50%",
        //   transform: "translateX(-50%)",
        //   width: "calc(100% - 24px - 16px)",
        //   height: 1,
        //   backgroundColor: theme.palette.divider,
        // },
        // "&:last-of-type:after": {
        //   height: 0,
        // },
        [`&[aria-selected="true"]`]: {
          backgroundColor: theme.palette.common.lightNeutral,
          "&:hover": {
            backgroundColor: theme.palette.common.neutral,
          },
          "&.Mui-focused": {
            backgroundColor: darken(
              theme.palette.common.lightNeutral,
              theme.palette.action.hoverOpacity
            ),
          },
        },
        "&.Mui-focused": {
          backgroundColor: alpha(
            theme.palette.common.neutral,
            theme.palette.action.focusOpacity
          ),
        },
      },
    },
    noOptions: {
      padding: theme.spacing(1.25, 2.5),
      minHeight: 70,
      display: "flex",
      alignItems: "center",
      color: theme.palette.text.primary,
      fontSize: theme.typography.bodyReg14.fontSize,
      fontWeight: theme.typography.bodyReg14.fontWeight,
      lineHeight: theme.typography.bodyReg14.lineHeight,
      fontFamily: theme.typography.bodyReg14.fontFamily,
    },
    loading: {
      padding: theme.spacing(1.25, 2.5),
      minHeight: 70,
      display: "flex",
      alignItems: "center",
      color: theme.palette.common.neutral,
      fontSize: theme.typography.bodyReg14.fontSize,
      fontWeight: theme.typography.bodyReg14.fontWeight,
      lineHeight: theme.typography.bodyReg14.lineHeight,
      fontFamily: theme.typography.bodyReg14.fontFamily,
    },
    hasPopupIcon: {
      [`&.${classes.root} .MuiOutlinedInput-root`]: {
        paddingRight: 28 + 8 + 1,
      },
      [`&.${classes.hasClearIcon}.${classes.root} .MuiOutlinedInput-root`]: {
        paddingRight: 28 * 2 + 8 + 1,
      },
      "& .MuiInputBase-inputAdornedEnd": {
        paddingLeft: 0,
      },
      "& .MuiInputBase-inputAdornedStart": {
        paddingRight: 0,
      },
    },
    hasClearIcon: {
      [`&.${classes.root} .MuiOutlinedInput-root`]: {
        paddingRight: 28 + 8 + 1,
      },
      [`&.${classes.hasClearIcon}.${classes.root} .MuiOutlinedInput-root`]: {
        paddingRight: 28 * 2 + 8 + 1,
      },
      "& .MuiInputBase-inputAdornedEnd": {
        paddingLeft: 0,
      },
      "& .MuiInputBase-inputAdornedStart": {
        paddingRight: 0,
      },
    },
    popupIndicator: {
      transition: theme.transitions.create(["transform"]),
    },
    endAdornment: {},
    selectedIcon: {
      fontSize: 24,
      marginRight: -2,
      color: "inherit",
    },
    popupIcon: {
      fontSize: 20,
      color: theme.palette.common.darkNeutral,
    },
    tag: {
      [`.${classes.root} &`]: {
        margin: 3,
        marginLeft: 0,
        "& + .MuiAutocomplete-input.MuiInputBase-inputAdornedStart": {
          paddingLeft: 3,
        },
      },
    },
  };
});

export default useStyles;
