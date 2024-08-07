import { forwardRef } from "react";

import { commonHelpers } from "@/utils/helpers";

import { ButtonBase } from "@mui/material";
import AppTypography from "@/components/AppTypography";

import useStyles from "./AppButton.styles";

import type { ButtonBaseProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type ButtonColor = "primary" | "secondary" | "inherit" | AppThemeColor;
type CheckboxEdge = "start" | "end" | "top" | "bottom" | "x" | "y" | "xy";
type ButtonTextColor = "default" | AppThemeColor;

type CustomButtonProps = {
  borderRadius?: "rounded" | "circular";
  edge?: CheckboxEdge | CheckboxEdge[];
  variant?: "text" | "contained" | "outlined" | "containedTonal";
  size?: "medium" | "small";
  fullMaxHeight?: boolean;
  color?: ButtonColor;
  textColor?: ButtonTextColor;
  endIcon?: React.ReactNode;
  startIcon?: React.ReactNode;
  disableHoverEffect?: boolean;
  fullWidth?: boolean;
  noWrap?: boolean;
  classes?: ButtonBaseProps["classes"] & {
    icon?: string;
    startIcon?: string;
    endIcon?: string;
  };
};

export type AppButtonProps = CustomButtonProps &
  Omit<ButtonBaseProps, keyof CustomButtonProps>;

type AppButtonTypeMap<P = {}, D extends React.ElementType = "button"> = {
  props: P & AppButtonProps;
  defaultComponent: D;
};
type AppButtonComponent = OverridableComponent<AppButtonTypeMap>;

const AppButton: AppButtonComponent = forwardRef(
  (props: AppButtonProps, ref: React.ForwardedRef<any>) => {
    const {
      borderRadius = "rounded",
      edge,
      classes: muiClasses,
      className,
      variant = "text",
      color = "primary",
      textColor,
      size = "medium",
      disableHoverEffect = false,
      fullMaxHeight,
      startIcon,
      endIcon,
      children,
      fullWidth,
      noWrap,
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

    const appButtonClasses = cx(classes.root, {
      [classes.fullMaxHeightSizeMedium]: !!fullMaxHeight && size === "medium",
      [classes.fullMaxHeightSizeSmall]: !!fullMaxHeight && size === "small",
      [classes.borderRadiusCircular]: borderRadius === "circular",
      [classes.noWrap]: !!noWrap,
      [classes.borderRadiusRounded]:
        borderRadius === "rounded" && size === "medium",
      [classes.borderRadiusRoundedSizeSmall]:
        borderRadius === "rounded" && size === "small",
      // containedTonal
      [classes.containedTonal]: variant === "containedTonal",
      [`${classes.containedTonalSizeMedium} ${commonHelpers.generateClassName(
        "button",
        "containedTonalSizeMedium"
      )}`]: variant === "containedTonal" && size === "medium",
      [`${classes.containedTonalSizeSmall} ${commonHelpers.generateClassName(
        "button",
        "containedTonalSizeSmall"
      )}`]: variant === "containedTonal" && size === "small",
      [`${classes.containedTonalEdgeStart} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeStart"
      )}`]: edges.includes("start") && variant === "containedTonal",
      [`${classes.containedTonalEdgeEnd} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeEnd"
      )}`]: edges.includes("end") && variant === "containedTonal",
      [`${classes.containedTonalEdgeTop} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeTop"
      )}`]: edges.includes("top") && variant === "containedTonal",
      [`${classes.containedTonalEdgeBottom} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeBottom"
      )}`]: edges.includes("bottom") && variant === "containedTonal",
      [`${classes.containedTonalEdgeX} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeX"
      )}`]: edges.includes("x") && variant === "containedTonal",
      [`${classes.containedTonalEdgeY} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeY"
      )}`]: edges.includes("y") && variant === "containedTonal",
      [`${classes.containedTonalEdgeXY} ${commonHelpers.generateClassName(
        "button",
        "containedTonalEdgeXY"
      )}`]: edges.includes("xy") && variant === "containedTonal",
      // Contained
      [classes.contained]: variant === "contained",
      [`${classes.containedSizeMedium} ${commonHelpers.generateClassName(
        "button",
        "containedSizeMedium"
      )}`]: variant === "contained" && size === "medium",
      [`${classes.containedSizeSmall} ${commonHelpers.generateClassName(
        "button",
        "containedSizeSmall"
      )}`]: variant === "contained" && size === "small",
      [`${classes.containedEdgeStart} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeStart"
      )}`]: edges.includes("start") && variant === "contained",
      [`${classes.containedEdgeEnd} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeEnd"
      )}`]: edges.includes("end") && variant === "contained",
      [`${classes.containedEdgeTop} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeTop"
      )}`]: edges.includes("top") && variant === "contained",
      [`${classes.containedEdgeBottom} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeBottom"
      )}`]: edges.includes("bottom") && variant === "contained",
      [`${classes.containedEdgeX} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeX"
      )}`]: edges.includes("x") && variant === "contained",
      [`${classes.containedEdgeY} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeY"
      )}`]: edges.includes("y") && variant === "contained",
      [`${classes.containedEdgeXY} ${commonHelpers.generateClassName(
        "button",
        "containedEdgeXY"
      )}`]: edges.includes("xy") && variant === "contained",
      // Outlined
      [classes.outlined]: variant === "outlined",
      [`${classes.outlinedSizeMedium} ${commonHelpers.generateClassName(
        "button",
        "outlinedSizeMedium"
      )}`]: variant === "outlined" && size === "medium",
      [`${classes.outlinedSizeSmall} ${commonHelpers.generateClassName(
        "button",
        "outlinedSizeSmall"
      )}`]: variant === "outlined" && size === "small",
      [`${classes.outlinedEdgeStart} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeStart"
      )}`]: edges.includes("start") && variant === "outlined",
      [`${classes.outlinedEdgeEnd} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeEnd"
      )}`]: edges.includes("end") && variant === "outlined",
      [`${classes.outlinedEdgeTop} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeTop"
      )}`]: edges.includes("top") && variant === "outlined",
      [`${classes.outlinedEdgeBottom} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeBottom"
      )}`]: edges.includes("bottom") && variant === "outlined",
      [`${classes.outlinedEdgeX} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeX"
      )}`]: edges.includes("x") && variant === "outlined",
      [`${classes.outlinedEdgeY} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeY"
      )}`]: edges.includes("y") && variant === "outlined",
      [`${classes.outlinedEdgeXY} ${commonHelpers.generateClassName(
        "button",
        "outlinedEdgeXY"
      )}`]: edges.includes("xy") && variant === "outlined",

      [classes.text]: variant === "text",
      [`${classes.textSizeMedium} ${commonHelpers.generateClassName(
        "button",
        "textSizeMedium"
      )}`]: variant === "text" && size === "medium",
      [`${classes.textSizeSmall} ${commonHelpers.generateClassName(
        "button",
        "textSizeSmall"
      )}`]: variant === "text" && size === "small",
      [`${classes.textEdgeStart} ${commonHelpers.generateClassName(
        "button",
        "textEdgeStart"
      )}`]: edges.includes("start") && variant === "text",
      [`${classes.textEdgeEnd} ${commonHelpers.generateClassName(
        "button",
        "textEdgeEnd"
      )}`]: edges.includes("end") && variant === "text",
      [`${classes.textEdgeTop} ${commonHelpers.generateClassName(
        "button",
        "textEdgeTop"
      )}`]: edges.includes("top") && variant === "text",
      [`${classes.textEdgeBottom} ${commonHelpers.generateClassName(
        "button",
        "textEdgeBottom"
      )}`]: edges.includes("bottom") && variant === "text",
      [`${classes.textEdgeX} ${commonHelpers.generateClassName(
        "button",
        "textEdgeX"
      )}`]: edges.includes("x") && variant === "text",
      [`${classes.textEdgeY} ${commonHelpers.generateClassName(
        "button",
        "textEdgeY"
      )}`]: edges.includes("y") && variant === "text",
      [`${classes.textEdgeXY} ${commonHelpers.generateClassName(
        "button",
        "textEdgeXY"
      )}`]: edges.includes("xy") && variant === "text",

      [`${classes.fullWidth} ${commonHelpers.generateClassName(
        "button",
        "fullWidth"
      )}`]: !!fullWidth,
    });

    return (
      <ButtonBase
        ref={ref}
        classes={{
          ...muiClasses,
          disabled: cx(classes.disabled, muiClasses?.disabled),
          root: cx(
            appButtonClasses,
            muiClasses?.root,
            className,
            !!sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
        type="button"
        {...rest}
      >
        {startIcon && (
          <span
            className={cx(
              classes.icon,
              classes.startIcon,
              muiClasses?.icon,
              muiClasses?.startIcon,
              commonHelpers.generateClassName("button", "startIcon")
            )}
          >
            {startIcon}
          </span>
        )}
        {!!noWrap ? (
          <AppTypography variant="inherit" component={"span"} noWrap>
            {children}
          </AppTypography>
        ) : (
          children
        )}
        {endIcon && (
          <span
            className={cx(
              classes.icon,
              classes.endIcon,
              muiClasses?.icon,
              muiClasses?.endIcon,
              commonHelpers.generateClassName("button", "endIcon")
            )}
          >
            {endIcon}
          </span>
        )}
      </ButtonBase>
    );
  }
);

export default AppButton;
