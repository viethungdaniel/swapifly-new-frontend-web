import { forwardRef } from "react";

import { ListItem } from "@mui/material";

import useStyles from "./AppListItem.styles";

import type { ListItemProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type AppListItemProps = ListItemProps;

type AppListItemTypeMap<P = {}, D extends React.ElementType = "li"> = {
  props: P & AppListItemProps;
  defaultComponent: D;
};
type AppListItemComponent = OverridableComponent<AppListItemTypeMap>;

const AppListItem: AppListItemComponent = forwardRef(
  (props: AppListItemProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, sx, ...rest } = props;

    const { classes, theme, css, cx } = useStyles();

    return (
      <ListItem
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
          padding: cx(
            classes.padding,
            muiClasses?.padding,
            sx && css(theme.unstable_sx(sx) as any)
          ),
          selected: cx(classes.selected, muiClasses?.selected),
        }}
      />
    );
  }
);

export default AppListItem;
