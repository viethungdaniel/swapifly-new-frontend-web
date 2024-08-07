import { forwardRef } from "react";

import { Toolbar } from "@mui/material";

import useStyles from "./AppToolbar.styles";

import type { ToolbarProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type CustomToolbarProps = {};

export type AppToolbarProps = Omit<ToolbarProps, keyof CustomToolbarProps> &
  CustomToolbarProps;

interface AppToolbarTypeMap<P = {}, D extends React.ElementType = "div"> {
  props: P & AppToolbarProps;
  defaultComponent: D;
}

type AppToolbarComponent = OverridableComponent<AppToolbarTypeMap>;

const AppToolbar: AppToolbarComponent = forwardRef(
  (props: AppToolbarProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, sx, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <Toolbar
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
      />
    );
  }
);

export default AppToolbar;
