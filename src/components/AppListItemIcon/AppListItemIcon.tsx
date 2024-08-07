import { forwardRef } from "react";

import { ListItemIcon } from "@mui/material";

import useStyles from "./AppListItemIcon.styles";

import type { ListItemIconProps } from "@mui/material";

export type AppListItemIconProps = ListItemIconProps;

const AppListItemIcon = forwardRef(
  (props: AppListItemIconProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, sx, ...rest } = props;

    const { classes, theme, css, cx } = useStyles();

    return (
      <ListItemIcon
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

export default AppListItemIcon;
