import { alpha, darken, rgbToHex } from "@mui/material/styles";
import _get from "lodash/get";
import { makeStyles } from "tss-react/mui";

type StylesParams = {
  color: string;
  textColor: string;
};

const colorToPalettePathMap = {
  default: "common.bg",
};

const textColorToPalettePathMap = {
  textPrimary: "text.primary",
};

const useStyles = makeStyles<
  StylesParams,
  | "clickable"
  | "avatarMedium"
  | "deleteIcon"
  | "iconMedium"
  | "sizeMedium"
  | "sizeSmall"
>({
  name: "appChip",
  uniqId: "m11y7A",
})((theme, params, classes) => {
  const color =
    params.color === "default"
      ? theme.palette.primary.main
      : _get(
          theme.palette,
          colorToPalettePathMap[
            params?.color as keyof typeof colorToPalettePathMap
          ] || params?.color
        ) ||
        params?.color ||
        theme.palette.grey[100];

  const textColor =
    params.textColor === "default" || !params.textColor
      ? theme.palette.getContrastText(color)
      : _get(
          theme.palette,
          textColorToPalettePathMap[
            params.textColor as keyof typeof textColorToPalettePathMap
          ] ?? params.textColor
        ) || params.textColor;

  return {
    root: {
      [`& .${classes.avatarMedium}`]: {
        marginRight: theme.spacing(-1.25 / 2),
        marginLeft: 4,
        width: 22,
        height: 22,
      },
      [`& .${classes.iconMedium}`]: {
        color: textColor,
        marginRight: theme.spacing(-1.25 / 2),
        marginLeft: 4,
      },
      [`& .${classes.deleteIcon}`]: {
        fontSize: 10,
        color: textColor,
        marginRight: theme.spacing(1),
        marginLeft: -2,
        "&:hover": {
          color: darken(textColor, theme.palette.action.hoverOpacity),
        },
      },
    },
    borderRadiusRounded: {
      borderRadius: theme.shape.borderRadius / 2,
    },
    label: {
      ...theme.typography.bodyReg14,
    },
    sizeMedium: {
      height: 30,
    },
    sizeSmall: {
      height: 24,
    },
    labelMedium: {
      paddingLeft: theme.spacing(1.25),
      paddingRight: theme.spacing(1.25),
    },
    labelSmall: {
      paddingLeft: theme.spacing(1),
      paddingRight: theme.spacing(1),
    },
    outlinedPrimary: {},
    filled: {
      backgroundColor: color,
      color: textColor,
      [`&.${classes.clickable}`]: {
        "&:hover": {
          backgroundColor: darken(color, theme.palette.contrastThreshold / 10),
        },
      },
    },
    filledTonal: {
      backgroundColor: alpha(color, 0.15),
      color: textColor,
      [`&.${classes.clickable}`]: {
        "&:hover": {
          backgroundColor: darken(
            rgbToHex(alpha(color, 0.15)),
            theme.palette.contrastThreshold / 10
          ),
        },
      },
    },
    outlined: {
      borderColor: color,
      color: params.textColor === "default" ? color : textColor,
      [`&.${classes.clickable}`]: {
        "&:hover": {
          backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
        },
      },
    },
    avatarMedium: {},
    iconMedium: {},
    deleteIcon: {},
    clickable: {},
  };
});

export default useStyles;
