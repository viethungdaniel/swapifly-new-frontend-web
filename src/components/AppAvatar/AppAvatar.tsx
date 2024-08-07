import { forwardRef } from "react";

import { Avatar } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";

import UserIcon from "@@/public/images/icons/user.svg";

import useStyles from "./AppAvatar.styles";

import type { AvatarProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type AppAvatarProps = AvatarProps;

type AppAvatarTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppAvatarProps;
  defaultComponent: D;
};
type AppAvatarComponent = OverridableComponent<AppAvatarTypeMap>;

const AppAvatar: AppAvatarComponent = forwardRef(
  (props: AppAvatarProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, className, children, sx, ...rest } = props;

    const { classes, theme, css, cx } = useStyles();

    return (
      <Avatar
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            className,
            !!sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
        {...rest}
      >
        {children ? (
          children
        ) : (
          <AppSvgIcon className={classes.userIcon} component={UserIcon} />
        )}
      </Avatar>
    );
  }
);

export default AppAvatar;
