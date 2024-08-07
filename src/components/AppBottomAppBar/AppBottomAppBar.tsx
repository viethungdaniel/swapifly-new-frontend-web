import { forwardRef } from "react";

import { AppBar } from "@mui/material";

import useStyles from "./AppBottomAppBar.styles";

import type { AppBarProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomAppBottomAppBarProps = {};

export type AppBottomAppBarProps = CustomAppBottomAppBarProps &
  Omit<AppBarProps, keyof CustomAppBottomAppBarProps>;

type AppBottomAppBarTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppBottomAppBarProps;
  defaultComponent: D;
};
type AppBottomAppBarComponent = OverridableComponent<AppBottomAppBarTypeMap>;

const AppBottomAppBar: AppBottomAppBarComponent = forwardRef(
  (props: AppBottomAppBarProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <AppBar
        ref={ref}
        component="div"
        {...rest}
        elevation={0}
        color="default"
        classes={{
          ...muiClasses,
          root: cx(classes.root, muiClasses?.root, className),
        }}
      />
    );
  }
);

export default AppBottomAppBar;
