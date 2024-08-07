import { alpha, darken, rgbToHex } from "@mui/material/styles";
import _get from "lodash/get";
import { makeStyles } from "tss-react/mui";
import type { AppIconButtonProps } from "./AppIconButton";

type MakeStylesParams = {
  color: AppIconButtonProps["color"];
  textColor: AppIconButtonProps["textColor"];
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
>({
  name: "appIconButton",
  uniqId: "kta7l1",
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
  const containedTonalSizeMediumPaddingX = "8px" as unknown as number;
  const containedTonalSizeMediumPaddingY = "8px" as unknown as number;

  const containedSizeMediumPaddingX = "8px" as unknown as number;
  const containedSizeMediumPaddingY = "8px" as unknown as number;

  const textSizeMediumPaddingX = "8px" as unknown as number;
  const textSizeMediumPaddingY = "8px" as unknown as number;

  const outlinedSizeMediumPaddingX = "7px" as unknown as number;
  const outlinedSizeMediumPaddingY = "7px" as unknown as number;
  // Small
  const containedTonalSizeSmallPaddingX = "6px" as unknown as number;
  const containedTonalSizeSmallPaddingY = "6px" as unknown as number;

  const containedSizeSmallPaddingX = "6px" as unknown as number;
  const containedSizeSmallPaddingY = "6px" as unknown as number;

  const textSizeSmallPaddingX = "6px" as unknown as number;
  const textSizeSmallPaddingY = "6px" as unknown as number;

  const outlinedSizeSmallPaddingX = "5px" as unknown as number;
  const outlinedSizeSmallPaddingY = "5px" as unknown as number;

  return {
    root: {
      color,
      borderRadius: theme.shape.borderRadius,
      "&:hover": {
        backgroundColor: disableHoverEffect
          ? "initial"
          : alpha(color, theme.palette.action.hoverOpacity),
      },
      [`&.${classes.disabled}`]: {
        color: theme.palette.grey[400],
      },
    },
    borderRadiusRounded: {
      borderRadius: theme.shape.borderRadius,
    },
    borderRadiusCircular: {
      borderRadius: "50px",
    },
    borderRadiusRoundedSizeSmall: {
      borderRadius: theme.shape.borderRadius / 2,
    },

    text: {},
    textSizeMedium: {
      fontSize: 24,
      padding: theme.spacing(textSizeMediumPaddingY, textSizeMediumPaddingX),
    },
    textSizeSmall: {
      fontSize: 20,
      padding: theme.spacing(textSizeSmallPaddingY, textSizeSmallPaddingX),
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
      color: params.textColor === "default" ? color : textColor,
      "&:hover": !disableHoverEffect
        ? {
            backgroundColor: alpha(color, theme.palette.action.hoverOpacity),
          }
        : undefined,
    },
    outlinedSizeMedium: {
      fontSize: 24,
      padding: theme.spacing(
        outlinedSizeMediumPaddingY,
        outlinedSizeMediumPaddingX
      ),
    },
    outlinedSizeSmall: {
      fontSize: 20,
      padding: theme.spacing(
        outlinedSizeSmallPaddingY,
        outlinedSizeSmallPaddingX
      ),
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
      [`&.${classes.disabled}`]: {
        backgroundColor: theme.palette.grey[400],
        color: theme.palette.common.white,
      },
    },
    containedTonalSizeMedium: {
      fontSize: 24,
      padding: theme.spacing(
        containedTonalSizeMediumPaddingY,
        containedTonalSizeMediumPaddingX
      ),
    },
    containedTonalSizeSmall: {
      fontSize: 20,
      padding: theme.spacing(
        containedTonalSizeSmallPaddingY,
        containedTonalSizeSmallPaddingX
      ),
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
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    containedTonalEdgeEnd: {
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    containedTonalEdgeTop: {
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    containedTonalEdgeBottom: {
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    containedTonalEdgeX: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    containedTonalEdgeY: {
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    containedTonalEdgeXY: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },

    contained: {
      backgroundColor: color,
      color: textColor,
      "&:hover": {
        backgroundColor: disableHoverEffect
          ? color
          : darken(color, theme.palette.contrastThreshold / 10),
      },
      [`&.${classes.disabled}`]: {
        backgroundColor: theme.palette.grey[400],
        color: theme.palette.common.white,
      },
    },
    containedSizeMedium: {
      fontSize: 24,
      padding: theme.spacing(
        containedSizeMediumPaddingY,
        containedSizeMediumPaddingX
      ),
    },
    containedSizeSmall: {
      fontSize: 20,
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
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    containedEdgeEnd: {
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    containedEdgeTop: {
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    containedEdgeBottom: {
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    containedEdgeX: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
    },
    containedEdgeY: {
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    containedEdgeXY: {
      marginLeft: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginRight: `-${theme.spacing(textSizeMediumPaddingX)}`,
      marginTop: `-${theme.spacing(textSizeMediumPaddingY)}`,
      marginBottom: `-${theme.spacing(textSizeMediumPaddingY)}`,
    },
    disabled: {},
  };
});

export default useStyles;
