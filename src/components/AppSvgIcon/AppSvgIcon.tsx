import { forwardRef } from "react";

import { Icon } from "@mui/material";

import useStyles from "./AppSvgIcon.styles";

import type { IconProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomSvgIconProps = {
  color?: "primary" | "error" | AppThemeColor;
};

export type AppSvgIconProps = Omit<IconProps, keyof CustomSvgIconProps> &
  CustomSvgIconProps;

type AppSvgIconTypeMap<P = {}, D extends React.ElementType = "span"> = {
  props: P & AppSvgIconProps;
  defaultComponent: D;
};
type AppSvgIconComponent = OverridableComponent<AppSvgIconTypeMap>;

const AppSvgIcon: AppSvgIconComponent = forwardRef(
  (props: AppSvgIconProps, ref: React.ForwardedRef<any>) => {
    const { color, className, classes: muiClasses, sx, ...rest } = props;

    const { classes, theme, css, cx } = useStyles({ color });

    const appSvgIconClasses = cx(classes.root, {
      [className as string]: !!className,
    });

    return (
      <Icon
        ref={ref}
        className={appSvgIconClasses}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(muiClasses?.root, sx && css(theme.unstable_sx(sx) as any)),
          fontSizeSmall: cx(classes.fontSizeSmall),
        }}
      />
    );
  }
);

export default AppSvgIcon;
