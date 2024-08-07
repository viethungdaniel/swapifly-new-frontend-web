import React, { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppDrawerBody.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomDrawerBodyProps = {
  disablePadding?: boolean;
};

export type AppDrawerBodyProps = Omit<BoxProps, keyof CustomDrawerBodyProps> &
  CustomDrawerBodyProps;

type AppDrawerBodyTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppDrawerBodyProps;
  defaultComponent: D;
};
type AppDrawerBodyComponent = OverridableComponent<AppDrawerBodyTypeMap>;

const AppDrawerBody: AppDrawerBodyComponent = forwardRef(
  (props: AppDrawerBodyProps, ref: React.ForwardedRef<any>) => {
    const { className, children, disablePadding, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <Box
        className={cx(
          classes.root,
          !disablePadding && classes.padding,
          className
        )}
        ref={ref}
        {...rest}
      >
        {children}
      </Box>
    );
  }
);

export default AppDrawerBody;
