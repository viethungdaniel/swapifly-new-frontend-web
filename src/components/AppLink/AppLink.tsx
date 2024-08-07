import { forwardRef } from "react";

import { Link } from "@mui/material";
import NextLink from "next/link";

import useStyles from "./AppLink.styles";

import type { LinkProps } from "@mui/material";
import type { LinkProps as NextLinkProps } from "next/link";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomLinkProps = NextLinkProps & {
  enableSmoothScrolling?: boolean;
  hoverColor?: "primary" | "secondary" | "error" | "none" | AppThemeColor;
  disabledNextLink?: boolean;
};

export type AppLinkProps = Omit<LinkProps, keyof CustomLinkProps> &
  CustomLinkProps;

interface AppLinkTypeMap<P = {}, D extends React.ElementType = "a"> {
  props: P & AppLinkProps;
  defaultComponent: D;
}
type AppLinkComponent = OverridableComponent<AppLinkTypeMap>;

const AppLink: AppLinkComponent = forwardRef(
  (props: AppLinkProps, ref: React.ForwardedRef<any>) => {
    const {
      href,
      className,
      classes: muiClasses,
      sx,
      hoverColor = "primary",
      disabledNextLink,
      component,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles({ hoverColor });

    return (
      <Link
        ref={ref}
        component={!!disabledNextLink ? "a" : NextLink}
        variant="bodyReg14"
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
        href={href}
      />
    );
  }
);

export default AppLink;
