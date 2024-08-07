import { forwardRef } from "react";

import { ListItemButton } from "@mui/material";

import useStyles from "./AppListItemButton.styles";

import type { ListItemButtonProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomListItemButtonProps = {
  disableHover?: boolean;
};

export type AppListItemButtonProps = Omit<
  ListItemButtonProps,
  keyof CustomListItemButtonProps
> &
  CustomListItemButtonProps;

type AppListItemButtonTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppListItemButtonProps;
  defaultComponent: D;
};
type AppListItemButtonComponent =
  OverridableComponent<AppListItemButtonTypeMap>;

const AppListItemButton: AppListItemButtonComponent = forwardRef(
  (props: AppListItemButtonProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, sx, disableHover, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <ListItemButton
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            {
              [classes.disableHover]: !!disableHover,
            },
            className,
            !!sx && css(theme.unstable_sx(sx) as any)
          ),
          focusVisible: cx(classes.focusVisible, muiClasses?.focusVisible),
          gutters: cx(classes.gutters, muiClasses?.gutters),
          selected: cx(classes.selected, muiClasses?.selected),
        }}
      />
    );
  }
);

export default AppListItemButton;
