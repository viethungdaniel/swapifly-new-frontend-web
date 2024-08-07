import { forwardRef } from "react";

import { Badge } from "@mui/material";

import useStyles from "./AppBadge.styles";

import type { BadgeProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type BadgeColor = "primary" | "secondary" | "error" | AppThemeColor;

type CustomBadgeProps = {
  color?: BadgeColor;
};

export type AppBadgeProps = CustomBadgeProps &
  Omit<BadgeProps, keyof CustomBadgeProps>;

type AppBadgeTypeMap<P = {}, D extends React.ElementType = "span"> = {
  props: P & AppBadgeProps;
  defaultComponent: D;
};
type AppBadgeComponent = OverridableComponent<AppBadgeTypeMap>;

const AppBadge: AppBadgeComponent = forwardRef(
  (props: AppBadgeProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, color, ...rest } = props;

    const { classes, cx } = useStyles({ color });

    return (
      <Badge
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          badge: cx(classes.badge, muiClasses?.badge),
        }}
      />
    );
  }
);

export default AppBadge;
