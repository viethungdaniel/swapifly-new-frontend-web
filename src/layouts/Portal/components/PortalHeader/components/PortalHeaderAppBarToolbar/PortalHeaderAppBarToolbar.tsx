import { forwardRef } from "react";

import { Toolbar } from "@mui/material";

import useStyles from "./PortalHeaderAppBarToolbar.styles";

import type { ToolbarProps } from "@mui/material";

const PortalHeaderAppBarToolbar = forwardRef(
  (props: ToolbarProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, ...rest } = props;
    const { classes, cx } = useStyles();

    return (
      <Toolbar
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(classes.root, muiClasses?.root, className),
        }}
      />
    );
  }
);

export default PortalHeaderAppBarToolbar;
