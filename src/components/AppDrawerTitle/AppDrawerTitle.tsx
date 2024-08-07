import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppDrawerTitle.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomDrawerTitleProps = {
  stickyHeader?: boolean;
};

export type AppDrawerTitleProps = Omit<BoxProps, keyof CustomDrawerTitleProps> &
  CustomDrawerTitleProps;

type AppDrawerTitleTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppDrawerTitleProps;
  defaultComponent: D;
};
type AppDrawerTitleComponent = OverridableComponent<AppDrawerTitleTypeMap>;

const AppDrawerTitle: AppDrawerTitleComponent = forwardRef(
  (props: AppDrawerTitleProps, ref: React.ForwardedRef<any>) => {
    const { className, children, stickyHeader, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <Box
        className={cx(
          classes.root,
          !!stickyHeader && classes.stickyHeader,
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

export default AppDrawerTitle;
