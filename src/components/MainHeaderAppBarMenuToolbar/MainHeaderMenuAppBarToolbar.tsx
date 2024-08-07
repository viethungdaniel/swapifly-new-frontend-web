import { forwardRef } from "react";

import { Toolbar } from "@mui/material";

import useStyles from "./MainHeaderMenuAppBarToolbar.styles";

import type { ToolbarProps } from "@mui/material";

const MainHeaderMenuAppBarToolbar = forwardRef(
  (props: ToolbarProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <Toolbar
        classes={{
          ...muiClasses,
          root: cx(classes.root, muiClasses?.root && muiClasses.root),
        }}
        ref={ref}
        disableGutters
        {...rest}
      />
    );
  }
);

export default MainHeaderMenuAppBarToolbar;
