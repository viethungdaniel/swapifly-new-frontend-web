import { forwardRef } from "react";

import { Toolbar } from "@mui/material";

import useStyles from "./MainBottomAppBarToolbar.styles";

import type { ToolbarProps } from "@mui/material";

type CustomMainBottomAppBarToolbar = {
  autoHeight?: boolean;
  enablePaddingY?: boolean;
};

type MainBottomAppBarToolbar = Omit<
  ToolbarProps,
  keyof CustomMainBottomAppBarToolbar
> &
  CustomMainBottomAppBarToolbar;

const MainBottomAppBarToolbar = forwardRef(
  (props: MainBottomAppBarToolbar, ref: React.ForwardedRef<any>) => {
    const {
      classes: muiClasses,
      autoHeight,
      enablePaddingY,
      className,
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    return (
      <Toolbar
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            {
              [classes.autoHeight]: !!autoHeight,
              [classes.paddingY]: !!enablePaddingY,
            },
            className
          ),
        }}
      />
    );
  }
);

export default MainBottomAppBarToolbar;
