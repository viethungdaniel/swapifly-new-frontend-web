import { alpha, darken, rgbToHex } from "@mui/material/styles";
import _get from "lodash/get";
import { makeStyles } from "tss-react/mui";
import type { AppButtonProps } from "./AppButton";

type MakeStylesParams = {
  color: AppButtonProps["color"];
  textColor: AppButtonProps["textColor"];
  disableHoverEffect: boolean;
};

const textColorToThemePalettePathMap = {
  primary: "primary.contrastText",
  secondary: "secondary.contrastText",
} as {
  [key: string]: string;
};

const colorToThemePalettePathMap = {
  primary: "primary.main",
  secondary: "secondary.main",
} as {
  [key: string]: string;
};

const useStyles = makeStyles<
  MakeStylesParams,
  | "containedTonalEdgeStart"
  | "containedTonalEdgeEnd"
  | "containedTonalEdgeTop"
  | "containedTonalEdgeBottom"
  | "containedTonalEdgeX"
  | "containedTonalEdgeY"
  | "containedTonalEdgeXY"
  | "containedEdgeStart"
  | "containedEdgeEnd"
  | "containedEdgeTop"
  | "containedEdgeBottom"
  | "containedEdgeX"
  | "containedEdgeY"
  | "containedEdgeXY"
  | "outlinedEdgeStart"
  | "outlinedEdgeEnd"
  | "outlinedEdgeTop"
  | "outlinedEdgeBottom"
  | "outlinedEdgeX"
  | "outlinedEdgeY"
  | "outlinedEdgeXY"
  | "textEdgeStart"
  | "textEdgeEnd"
  | "textEdgeTop"
  | "textEdgeBottom"
  | "textEdgeX"
  | "textEdgeY"
  | "textEdgeXY"
  | "disabled"
  | "startIcon"
  | "endIcon"
>({
  name: "appButton",
  uniqId: "kta7lJ",
})((theme, params, classes) => {
  const color = (_get(
    theme.palette,
    colorToThemePalettePathMap[params.color!]
  ) ||
    _get(theme.palette, params.color!) ||
    (params.color ?? "white")) as string;

  const textColor =
    _get(theme.palette, textColorToThemePalettePathMap[params.color!]) ||
    _get(theme.palette, params.textColor!) ||
    (params.textColor ?? theme.palette.getContrastText(color));

  const disableHoverEffect = !!params.disableHoverEffect;
  // Medium
  const containedTonalSizeMediumPaddingX = "20px" as unknown as number;
  const containedTonalSizeMediumPaddingY = "9.5px" as unknown as number;

  const containedSizeMediumPaddingX = "20px" as unknown as number;
  const containedSizeMediumPaddingY = "9.5px" as unknown as number;

  const textSizeMediumPaddingX = "10px" as unknown as number;
  const textSizeMediumPaddingY = "9.5px" as unknown as number;

  const outlinedSizeMediumPaddingX = "19px" as unknown as number;
  const outlinedSizeMediumPaddingY = "8.5px" as unknown as number;
  // Small
  const containedTonalSizeSmallPaddingX = "10px" as unknown as number;
  const containedTonalSizeSmallPaddingY = "4.5px" as unknown as number;

  const containedSizeSmallPaddingX = "10px" as unknown as number;
  const containedSizeSmallPaddingY = "4.5px" as unknown as number;

  const textSizeSmallPaddingX = "5px" as unknown as number;
  const textSizeSmallPaddingY = "4.5px" as unknown as number;

  const outlinedSizeSmallPaddingX = "9px" as unknown as number;
  const outlinedSizeSmallPaddingY = "3.5px" as unknown as number;

  return {
    root: {
      fontFamily: theme.typography.button.fontFamily,
      fontSize: theme.typography.button.fontSize,
      fontWeight: theme.typography.button.fontWeight,
      textTransform: theme.typography.button.textTransform,
      lineHeight: "normal",
      color,
      "&:hover": {
        backgroundColor: disableHoverEffect
          ? color
          : alpha(color, theme.palette.action.hoverOpacity),
      },
      [`&.${classes.disabled}`]: {
        backgroundColor: theme.palette.common.lightNeutral,
        color: theme.palette.common.neutral,
        borderColor: theme.palette.common.neutral,
      },
    },
    noWrap: {
      overflow: "hidden",
    },
    borderRadiusRounded: {
      borderRadius: theme.shape.borderRadius,
    },
    borderRadiusCircular: {
      borderRadius: "40px",
    },
    borderRadiusRoundedSizeSmall: {
      borderRadius: theme.shape.borderRadius / 2,
    },
    fullMaxHeightSizeMedium: {
      maxHeight: 40,
    },
    fullMaxHeightSizeSmall: {
      maxHeight: 30,
    },

    text: {
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${textSizeMediumPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${textSizeMediumPaddingX}/2 + 2px)`,
      },
      [`&.${classes.disabled}`]: {
        backgroundColor: "transparent",
        color: theme.palette.common.neutral,
      },
    },
    textSizeMedium: {
      padding: theme.spacing(textSizeMediumPaddingY, textSizeMediumPaddingX),
    },
    textSizeSmall: {
      padding: theme.spacing(textSizeSmallPaddingY, textSizeSmallPaddingX),
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${textSizeSmallPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${textSizeSmallPaddingX}/2 + 2px)`,
      },
      [`&.${classes.textEdgeStart}`]: {
        marginLeft: `-${theme.spacing(textSizeSmallPaddingX)}`,
      },
      [`&.${classes.textEdgeEnd}`]: {
        marginRight: `-${theme.spacing(textSizeSmallPaddingX)}`,
      },
      [`&.${classes.textEdgeTop}`]: {
        marginTop: `-${theme.spacing(textSizeSmallPaddingY)}`,
      },
      [`&.${classes.textEdgeBottom}`]: {
        marginBottom: `-${theme.spacing(textSizeSmallPaddingY)}`,
      },
      [`&.${classes.textEdgeX}`]: {
        marginLeft: `-${theme.spacing(textSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(textSizeSmallPaddingX)}`,
      },
      [`&.${classes.textEdgeY}`]: {
        marginTop: `-${theme.spacing(textSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(textSizeSmallPaddingY)}`,
      },
      [`&.${classes.textEdgeXY}`]: {
        marginTop: `-${theme.spacing(textSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(textSizeSmallPaddingY)}`,
        marginLeft: `-${theme.spacing(textSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(textSizeSmallPaddingX)}`,
      },
    },
    textEdgeStart: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    textEdgeEnd: {
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    textEdgeTop: {
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    textEdgeBottom: {
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    textEdgeX: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    textEdgeY: {
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    textEdgeXY: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },

    outlined: {
      border: `1px solid ${color}`,
      color: !params.textColor ? color : textColor,
      "&:hover": !disableHoverEffect
        ? {
            backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
          }
        : undefined,
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${outlinedSizeMediumPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${outlinedSizeMediumPaddingX}/2 + 2px)`,
      },
    },
    outlinedSizeMedium: {
      padding: theme.spacing(
        outlinedSizeMediumPaddingY,
        outlinedSizeMediumPaddingX
      ),
    },
    outlinedSizeSmall: {
      padding: theme.spacing(
        outlinedSizeSmallPaddingY,
        outlinedSizeSmallPaddingX
      ),
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${outlinedSizeSmallPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${outlinedSizeSmallPaddingX}/2 + 2px)`,
      },
      [`&.${classes.outlinedEdgeStart}`]: {
        marginLeft: `-${theme.spacing(outlinedSizeSmallPaddingX)}`,
      },
      [`&.${classes.outlinedEdgeEnd}`]: {
        marginRight: `-${theme.spacing(outlinedSizeSmallPaddingX)}`,
      },
      [`&.${classes.outlinedEdgeTop}`]: {
        marginTop: `-${theme.spacing(outlinedSizeSmallPaddingY)}`,
      },
      [`&.${classes.outlinedEdgeBottom}`]: {
        marginBottom: `-${theme.spacing(outlinedSizeSmallPaddingY)}`,
      },
      [`&.${classes.outlinedEdgeX}`]: {
        marginLeft: `-${theme.spacing(outlinedSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(outlinedSizeSmallPaddingX)}`,
      },
      [`&.${classes.outlinedEdgeY}`]: {
        marginTop: `-${theme.spacing(outlinedSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(outlinedSizeSmallPaddingY)}`,
      },
      [`&.${classes.outlinedEdgeXY}`]: {
        marginTop: `-${theme.spacing(outlinedSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(outlinedSizeSmallPaddingY)}`,
        marginLeft: `-${theme.spacing(outlinedSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(outlinedSizeSmallPaddingX)}`,
      },
    },
    outlinedEdgeStart: {
      marginLeft: `-${theme.spacing(outlinedSizeMediumPaddingX)}`,
    },
    outlinedEdgeEnd: {
      marginRight: `-${theme.spacing(outlinedSizeMediumPaddingX)}`,
    },
    outlinedEdgeTop: {
      marginTop: `-${theme.spacing(outlinedSizeMediumPaddingY)}`,
    },
    outlinedEdgeBottom: {
      marginBottom: `-${theme.spacing(outlinedSizeMediumPaddingY)}`,
    },
    outlinedEdgeX: {
      marginLeft: `-${theme.spacing(outlinedSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(outlinedSizeMediumPaddingX)}`,
    },
    outlinedEdgeY: {
      marginTop: `-${theme.spacing(outlinedSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(outlinedSizeMediumPaddingY)}`,
    },
    outlinedEdgeXY: {
      marginLeft: `-${theme.spacing(outlinedSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(outlinedSizeMediumPaddingX)}`,
      marginTop: `-${theme.spacing(outlinedSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(outlinedSizeMediumPaddingY)}`,
    },

    containedTonal: {
      backgroundColor: alpha(color, 0.15),
      color: !params.textColor ? color : textColor,
      "&:hover": {
        backgroundColor: disableHoverEffect
          ? alpha(color, 0.15)
          : darken(
              rgbToHex(alpha(color, 0.15)),
              theme.palette.contrastThreshold / 10
            ),
      },
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${containedSizeMediumPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${containedSizeMediumPaddingX}/2 + 2px)`,
      },
    },
    containedTonalSizeMedium: {
      padding: theme.spacing(
        containedTonalSizeMediumPaddingY,
        containedTonalSizeMediumPaddingX
      ),
    },
    containedTonalSizeSmall: {
      padding: theme.spacing(
        containedTonalSizeSmallPaddingY,
        containedTonalSizeSmallPaddingX
      ),
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${containedTonalSizeSmallPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${containedTonalSizeSmallPaddingX}/2 + 2px)`,
      },
      [`&.${classes.containedTonalEdgeStart}`]: {
        marginLeft: `-${theme.spacing(containedTonalSizeSmallPaddingX)}`,
      },
      [`&.${classes.containedTonalEdgeEnd}`]: {
        marginRight: `-${theme.spacing(containedTonalSizeSmallPaddingX)}`,
      },
      [`&.${classes.containedTonalEdgeTop}`]: {
        marginTop: `-${theme.spacing(containedTonalSizeSmallPaddingY)}`,
      },
      [`&.${classes.containedTonalEdgeBottom}`]: {
        marginBottom: `-${theme.spacing(containedTonalSizeSmallPaddingY)}`,
      },
      [`&.${classes.containedTonalEdgeX}`]: {
        marginLeft: `-${theme.spacing(containedTonalSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(containedTonalSizeSmallPaddingX)}`,
      },
      [`&.${classes.containedTonalEdgeY}`]: {
        marginTop: `-${theme.spacing(containedTonalSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(containedTonalSizeSmallPaddingY)}`,
      },
      [`&.${classes.containedTonalEdgeXY}`]: {
        marginTop: `-${theme.spacing(containedTonalSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(containedTonalSizeSmallPaddingY)}`,
        marginLeft: `-${theme.spacing(containedTonalSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(containedTonalSizeSmallPaddingX)}`,
      },
    },
    containedTonalEdgeStart: {
      marginLeft: `-${theme.spacing(containedTonalSizeMediumPaddingX)}`,
    },
    containedTonalEdgeEnd: {
      marginRight: `-${theme.spacing(containedTonalSizeMediumPaddingX)}`,
    },
    containedTonalEdgeTop: {
      marginTop: `-${theme.spacing(containedTonalSizeMediumPaddingY)}`,
    },
    containedTonalEdgeBottom: {
      marginBottom: `-${theme.spacing(containedTonalSizeMediumPaddingY)}`,
    },
    containedTonalEdgeX: {
      marginLeft: `-${theme.spacing(containedTonalSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(containedTonalSizeMediumPaddingX)}`,
    },
    containedTonalEdgeY: {
      marginTop: `-${theme.spacing(containedTonalSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(containedTonalSizeMediumPaddingY)}`,
    },
    containedTonalEdgeXY: {
      marginLeft: `-${theme.spacing(containedTonalSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(containedTonalSizeMediumPaddingX)}`,
      marginTop: `-${theme.spacing(containedTonalSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(containedTonalSizeMediumPaddingY)}`,
    },

    contained: {
      backgroundColor: color,
      color: textColor,
      "&:hover": {
        backgroundColor: disableHoverEffect
          ? color
          : darken(color, theme.palette.contrastThreshold / 10),
      },
      [`& .${classes.startIcon}`]: {
        marginLeft: `calc(-${containedSizeMediumPaddingX}/2 + 2px)`,
      },
      [`& .${classes.endIcon}`]: {
        marginRight: `calc(-${containedSizeMediumPaddingX}/2 + 2px)`,
      },
    },
    containedSizeMedium: {
      padding: theme.spacing(
        containedSizeMediumPaddingY,
        containedSizeMediumPaddingX
      ),
    },
    containedSizeSmall: {
      padding: theme.spacing(
        containedSizeSmallPaddingY,
        containedSizeSmallPaddingX
      ),
      [`&.${classes.containedEdgeStart}`]: {
        marginLeft: `-${theme.spacing(containedSizeSmallPaddingX)}`,
      },
      [`&.${classes.containedEdgeEnd}`]: {
        marginRight: `-${theme.spacing(containedSizeSmallPaddingX)}`,
      },
      [`&.${classes.containedEdgeTop}`]: {
        marginTop: `-${theme.spacing(containedSizeSmallPaddingY)}`,
      },
      [`&.${classes.containedEdgeBottom}`]: {
        marginBottom: `-${theme.spacing(containedSizeSmallPaddingY)}`,
      },
      [`&.${classes.containedEdgeX}`]: {
        marginLeft: `-${theme.spacing(containedSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(containedSizeSmallPaddingX)}`,
      },
      [`&.${classes.containedEdgeY}`]: {
        marginTop: `-${theme.spacing(containedSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(containedSizeSmallPaddingY)}`,
      },
      [`&.${classes.containedEdgeXY}`]: {
        marginTop: `-${theme.spacing(containedSizeSmallPaddingY)}`,
        marginBottom: `-${theme.spacing(containedSizeSmallPaddingY)}`,
        marginLeft: `-${theme.spacing(containedSizeSmallPaddingX)}`,
        marginRight: `-${theme.spacing(containedSizeSmallPaddingX)}`,
      },
    },
    containedEdgeStart: {
      marginLeft: `-${theme.spacing(containedSizeMediumPaddingX)}`,
    },
    containedEdgeEnd: {
      marginRight: `-${theme.spacing(containedSizeMediumPaddingX)}`,
    },
    containedEdgeTop: {
      marginTop: `-${theme.spacing(containedSizeMediumPaddingY)}`,
    },
    containedEdgeBottom: {
      marginBottom: `-${theme.spacing(containedSizeMediumPaddingY)}`,
    },
    containedEdgeX: {
      marginLeft: `-${theme.spacing(containedSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(containedSizeMediumPaddingX)}`,
    },
    containedEdgeY: {
      marginTop: `-${theme.spacing(containedSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(containedSizeMediumPaddingY)}`,
    },
    containedEdgeXY: {
      marginLeft: `-${theme.spacing(containedSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(containedSizeMediumPaddingX)}`,
      marginTop: `-${theme.spacing(containedSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(containedSizeMediumPaddingY)}`,
    },
    icon: {
      display: "flex",
      fontSize: 20,
    },
    endIcon: {
      marginLeft: theme.spacing(1),
    },
    startIcon: {
      marginRight: theme.spacing(1),
    },
    fullWidth: {
      width: "100%",
    },
    disabled: {},
  };
});

export default useStyles;
