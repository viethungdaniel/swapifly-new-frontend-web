import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppPosition.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export const placements = [
  "cover",
  "bottom",
  "bottom-start",
  "bottom-end",
  "top",
  "top-start",
  "top-end",
  "left",
  "left-start",
  "left-end",
  "right",
  "right-start",
  "right-end",
] as const;

type CustomAppPositionProps = {
  placement?: (typeof placements)[number];
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
  fullWidth?: boolean;
  gutter?: "small" | "medium" | "large";
};

type AppPositionProps = Omit<BoxProps, keyof CustomAppPositionProps> &
  CustomAppPositionProps;

type AppPositionTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppPositionProps;
  defaultComponent: D;
};
type AppPositionComponent = OverridableComponent<AppPositionTypeMap>;

const AppPosition: AppPositionComponent = forwardRef(
  (props: AppPositionProps, ref: React.ForwardedRef<any>) => {
    const {
      classes: appClasses,
      className,
      placement = "cover",
      position,
      fullWidth,
      gutter,
      sx,
      ...rest
    } = props;

    const { classes, theme, cx, css } = useStyles(undefined, {
      props: {
        classes: appClasses,
      },
    });

    return (
      <Box
        ref={ref}
        className={cx(
          classes.root,
          {
            [classes.gutterSmall]: gutter === "small",
            [classes.gutterMedium]: gutter === "medium",
            [classes.gutterLarge]: gutter === "large",
            [classes.fullWidth]: !!fullWidth,
            [classes.relative]: position === "relative",
            [classes.absolute]: position === "absolute",
            [classes.fixed]: position === "fixed",
            [classes.sticky]: position === "sticky",
            [classes.cover]: placement === "cover",
            [classes.bottom]: placement === "bottom",
            [classes.bottomStart]: placement === "bottom-start",
            [classes.bottomEnd]: placement === "bottom-end",
            [classes.top]: placement === "top",
            [classes.topStart]: placement === "top-start",
            [classes.topEnd]: placement === "top-end",
            [classes.left]: placement === "left",
            [classes.leftStart]: placement === "left-start",
            [classes.leftEnd]: placement === "left-end",
            [classes.right]: placement === "right",
            [classes.rightStart]: placement === "left-start",
            [classes.rightEnd]: placement === "right-end",
          },
          !!className && className,
          !!sx && css(theme.unstable_sx(sx) as any)
        )}
        {...rest}
      />
    );
  }
);

export default AppPosition;
