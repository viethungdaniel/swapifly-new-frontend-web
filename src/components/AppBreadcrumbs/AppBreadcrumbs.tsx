import { forwardRef } from "react";

import { Breadcrumbs } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";

import ArrowRightIcon from "@@/public/images/icons/arrow-right.svg";

import useStyles from "./AppBreadcrumbs.styles";

import type { BreadcrumbsProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type BreadcrumbsColor = "primary" | "secondary" | "error" | AppThemeColor;

type CustomBreadcrumbsProps = {
  color?: BreadcrumbsColor;
};

export type AppBreadcrumbsProps = CustomBreadcrumbsProps &
  Omit<BreadcrumbsProps, keyof CustomBreadcrumbsProps>;

type AppBreadcrumbsTypeMap<P = {}, D extends React.ElementType = "span"> = {
  props: P & AppBreadcrumbsProps;
  defaultComponent: D;
};
type AppBreadcrumbsComponent = OverridableComponent<AppBreadcrumbsTypeMap>;

const AppBreadcrumbs: AppBreadcrumbsComponent = forwardRef(
  (props: AppBreadcrumbsProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, sx, className, ...rest } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <Breadcrumbs
        ref={ref}
        separator={
          <AppSvgIcon
            className={classes.separatorIcon}
            component={ArrowRightIcon}
          />
        }
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            muiClasses?.root,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
      />
    );
  }
);

export default AppBreadcrumbs;
