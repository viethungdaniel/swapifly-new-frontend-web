import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppDrawerTitleIcon.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomDrawerTitleIconProps = {
  position?: "start" | "end";
};

export type AppDrawerTitleIconProps = Omit<
  BoxProps,
  keyof CustomDrawerTitleIconProps
> &
  CustomDrawerTitleIconProps;

type AppDrawerTitleIconTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppDrawerTitleIconProps;
  defaultComponent: D;
};
type AppDrawerTitleIconComponent =
  OverridableComponent<AppDrawerTitleIconTypeMap>;

const AppDrawerTitleIcon: AppDrawerTitleIconComponent = forwardRef(
  (props: AppDrawerTitleIconProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      children,
      component = "span",
      position = "start",
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    return (
      <Box
        ref={ref}
        className={cx(
          classes.root,
          {
            [classes.endIcon]: position === "end",
            [classes.startIcon]: position === "start",
          },
          className
        )}
        component={component}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

export default AppDrawerTitleIcon;
