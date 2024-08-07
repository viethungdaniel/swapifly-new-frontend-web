import { forwardRef } from "react";

import { commonHelpers } from "@/utils/helpers";

import { ButtonBase } from "@mui/material";

import useStyles from "./AppIconButton.styles";

import type { ButtonBaseProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type ButtonColor = "primary" | "secondary" | "inherit" | AppThemeColor;
type CheckboxEdge = "start" | "end" | "top" | "bottom" | "x" | "y" | "xy";
type ButtonTextColor = "default" | AppThemeColor;

type CustomIconButtonProps = {
  borderRadius?: "rounded" | "circular";
  edge?: CheckboxEdge | CheckboxEdge[];
  variant?: "text" | "contained" | "outlined" | "containedTonal";
  size?: "medium" | "small";
  color?: ButtonColor;
  textColor?: ButtonTextColor;
  disableHoverEffect?: boolean;
};

export type AppIconButtonProps = Omit<
  ButtonBaseProps,
  "size" | keyof CustomIconButtonProps
> &
  CustomIconButtonProps;

type AppIconButtonTypeMap<P = {}, D extends React.ElementType = "button"> = {
  props: P & AppIconButtonProps;
  defaultComponent: D;
};
type AppIconButtonComponent = OverridableComponent<AppIconButtonTypeMap>;

const AppIconButton: AppIconButtonComponent = forwardRef(
  (props: AppIconButtonProps, ref: React.ForwardedRef<any>) => {
    const {
      borderRadius,
      edge,
      classes: muiClasses,
      className,
      variant = "text",
      color = "primary",
      textColor,
      size = "medium",
      disableHoverEffect = false,
      sx,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles({
      color: color as any,
      textColor: textColor as any,
      disableHoverEffect,
    });

    const edges = Array.isArray(edge)
      ? edge
      : !commonHelpers.isEmpty(edge)
      ? [edge!]
      : [];

    const appButtonClasses = cx(
      classes.root,
      commonHelpers.generateClassName("iconButton", "root"),
      {
        [classes.borderRadiusCircular]: borderRadius === "circular",
        [classes.borderRadiusRounded]:
          borderRadius === "rounded" && size === "medium",
        [classes.borderRadiusRoundedSizeSmall]:
          borderRadius === "rounded" && size === "small",

        [classes.containedTonal]: variant === "containedTonal",
        [`${classes.containedTonalSizeMedium} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalSizeMedium"
        )}`]: variant === "containedTonal" && size === "medium",
        [`${classes.containedTonalSizeSmall} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalSizeSmall"
        )}`]: variant === "containedTonal" && size === "small",
        [`${classes.containedTonalEdgeStart} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeStart"
        )}`]: edges.includes("start") && variant === "containedTonal",
        [`${classes.containedTonalEdgeEnd} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeEnd"
        )}`]: edges.includes("end") && variant === "containedTonal",
        [`${classes.containedTonalEdgeTop} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeTop"
        )}`]: edges.includes("top") && variant === "containedTonal",
        [`${classes.containedTonalEdgeBottom} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeBottom"
        )}`]: edges.includes("bottom") && variant === "containedTonal",
        [`${classes.containedTonalEdgeX} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeX"
        )}`]: edges.includes("x") && variant === "containedTonal",
        [`${classes.containedTonalEdgeY} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeY"
        )}`]: edges.includes("y") && variant === "containedTonal",
        [`${classes.containedTonalEdgeXY} ${commonHelpers.generateClassName(
          "iconButton",
          "containedTonalEdgeXY"
        )}`]: edges.includes("xy") && variant === "containedTonal",

        [classes.contained]: variant === "contained",
        [`${classes.containedSizeMedium} ${commonHelpers.generateClassName(
          "iconButton",
          "containedSizeMedium"
        )}`]: variant === "contained" && size === "medium",
        [`${classes.containedSizeSmall} ${commonHelpers.generateClassName(
          "iconButton",
          "containedSizeSmall"
        )}`]: variant === "contained" && size === "small",
        [`${classes.containedEdgeStart} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeStart"
        )}`]: edges.includes("start") && variant === "contained",
        [`${classes.containedEdgeEnd} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeEnd"
        )}`]: edges.includes("end") && variant === "contained",
        [`${classes.containedEdgeTop} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeTop"
        )}`]: edges.includes("top") && variant === "contained",
        [`${classes.containedEdgeBottom} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeBottom"
        )}`]: edges.includes("bottom") && variant === "contained",
        [`${classes.containedEdgeX} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeX"
        )}`]: edges.includes("x") && variant === "contained",
        [`${classes.containedEdgeY} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeY"
        )}`]: edges.includes("y") && variant === "contained",
        [`${classes.containedEdgeXY} ${commonHelpers.generateClassName(
          "iconButton",
          "containedEdgeXY"
        )}`]: edges.includes("xy") && variant === "contained",

        [classes.outlined]: variant === "outlined",
        [`${classes.outlinedSizeMedium} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedSizeMedium"
        )}`]: variant === "outlined" && size === "medium",
        [`${classes.outlinedSizeSmall} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedSizeSmall"
        )}`]: variant === "outlined" && size === "small",
        [`${classes.outlinedEdgeStart} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeStart"
        )}`]: edges.includes("start") && variant === "outlined",
        [`${classes.outlinedEdgeEnd} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeEnd"
        )}`]: edges.includes("end") && variant === "outlined",
        [`${classes.outlinedEdgeTop} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeTop"
        )}`]: edges.includes("top") && variant === "outlined",
        [`${classes.outlinedEdgeBottom} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeBottom"
        )}`]: edges.includes("bottom") && variant === "outlined",
        [`${classes.outlinedEdgeX} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeX"
        )}`]: edges.includes("x") && variant === "outlined",
        [`${classes.outlinedEdgeY} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeY"
        )}`]: edges.includes("y") && variant === "outlined",
        [`${classes.outlinedEdgeXY} ${commonHelpers.generateClassName(
          "iconButton",
          "outlinedEdgeXY"
        )}`]: edges.includes("xy") && variant === "outlined",

        [classes.text]: variant === "text",
        [`${classes.textSizeMedium} ${commonHelpers.generateClassName(
          "iconButton",
          "textSizeMedium"
        )}`]: variant === "text" && size === "medium",
        [`${classes.textSizeSmall} ${commonHelpers.generateClassName(
          "iconButton",
          "textSizeSmall"
        )}`]: variant === "text" && size === "small",
        [`${classes.textEdgeStart} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeStart"
        )}`]: edges.includes("start") && variant === "text",
        [`${classes.textEdgeEnd} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeEnd"
        )}`]: edges.includes("end") && variant === "text",
        [`${classes.textEdgeTop} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeTop"
        )}`]: edges.includes("top") && variant === "text",
        [`${classes.textEdgeBottom} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeBottom"
        )}`]: edges.includes("bottom") && variant === "text",
        [`${classes.textEdgeX} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeX"
        )}`]: edges.includes("x") && variant === "text",
        [`${classes.textEdgeY} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeY"
        )}`]: edges.includes("y") && variant === "text",
        [`${classes.textEdgeXY} ${commonHelpers.generateClassName(
          "iconButton",
          "textEdgeXY"
        )}`]: edges.includes("xy") && variant === "text",
      },
      muiClasses?.root,
      className,
      sx && css(theme.unstable_sx(sx) as any)
    );

    return (
      <ButtonBase
        ref={ref}
        classes={{
          ...muiClasses,
          disabled: cx(classes.disabled, muiClasses?.disabled),
          root: appButtonClasses,
        }}
        {...rest}
      />
    );
  }
);

export default AppIconButton;
