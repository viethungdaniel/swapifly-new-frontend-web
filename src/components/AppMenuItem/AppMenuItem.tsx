import { forwardRef } from "react";

import { MenuItem } from "@mui/material";

import useStyles from "./AppMenuItem.styles";

import type { MenuItemProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type AppMenuItemProps = MenuItemProps;

type AppMenuItemTypeMap<P = {}, D extends React.ElementType = "li"> = {
  props: P & AppMenuItemProps;
  defaultComponent: D;
};
type AppMenuItemComponent = OverridableComponent<AppMenuItemTypeMap>;

const AppMenuItem: AppMenuItemComponent = forwardRef(
  (props: AppMenuItemProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, sx, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <MenuItem
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            className,
            !!sx && css(theme.unstable_sx(sx) as any)
          ),
          selected: cx(classes.selected, muiClasses?.selected),
        }}
      />
    );
  }
);

export default AppMenuItem;
