import { forwardRef } from "react";

import { commonHelpers } from "@/utils/helpers";

import AppMenuItem from "@/components/AppMenuItem";
import AppTypography from "@/components/AppTypography";
import AppSvgIcon from "@/components/AppSvgIcon";

import CheckedIcon from "@@/public/images/icons/checked.svg";

import useStyles from "./AppSelectMenuItem.styles";

import type { AppMenuItemProps } from "@/components/AppMenuItem";

type CustomAppMenuItemProps = {
  disabledCheckedIcon?: boolean;
  native?: boolean;
};

type AppSelectMenuItemProps = Omit<
  AppMenuItemProps,
  keyof CustomAppMenuItemProps
> &
  CustomAppMenuItemProps;

const AppSelectMenuItem = forwardRef(
  (props: AppSelectMenuItemProps, ref: React.ForwardedRef<any>) => {
    const {
      component,
      selected,
      children,
      disabledCheckedIcon,
      classes: muiClasses,
      native,
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    const isComponentOption =
      commonHelpers.isMobile() || component === "option";

    return (
      <AppMenuItem
        ref={ref}
        disableRipple={commonHelpers.isMobile()}
        {...rest}
        selected={selected}
        component={
          native !== false && commonHelpers.isMobile()
            ? "option"
            : component ?? "li"
        }
        classes={{
          ...muiClasses,
          selected: cx(classes.selected, muiClasses?.selected),
        }}
      >
        {isComponentOption ? (
          children
        ) : (
          <AppTypography variant="inherit" component="div" flex={1}>
            {children}
          </AppTypography>
        )}
        {selected && !isComponentOption && !disabledCheckedIcon && (
          <AppSvgIcon
            component={CheckedIcon}
            sx={{
              mr: "-4px",
            }}
            fontSize="small"
            color="inherit"
          />
        )}
      </AppMenuItem>
    );
  }
);

export default AppSelectMenuItem;
