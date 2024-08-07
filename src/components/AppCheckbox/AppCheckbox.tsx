import { forwardRef } from "react";

import { commonHelpers } from "@/utils/helpers";

import { Checkbox } from "@mui/material";

import AppSvgIcon from "@/components/AppSvgIcon";

import CheckedIcon from "@@/public/images/icons/checked-filled.svg";
import UncheckedIcon from "@@/public/images/icons/unchecked.svg";
import IndeterminateCheckBoxIcon from "@@/public/images/icons/indeterminate.svg";

import useStyles from "./AppCheckbox.styles";

import type { CheckboxProps } from "@mui/material";

type CheckboxColor = "primary" | "secondary" | "inherit" | AppThemeColor;
type CheckboxEdge = "start" | "end" | "top" | "bottom" | "x" | "y" | "xy";

type CustomAppCheckbox = {
  color?: CheckboxColor;
  defaultCheckedIconColor?: CheckboxColor;
  edge?: CheckboxEdge | CheckboxEdge[];
};

export type AppCheckboxProps = CustomAppCheckbox &
  Omit<CheckboxProps, "size" | keyof CustomAppCheckbox>;

const AppCheckbox = forwardRef(
  (props: AppCheckboxProps, ref: React.ForwardedRef<any>) => {
    const {
      color = "primary",
      defaultCheckedIconColor = "primary",
      edge,
      classes: muiClasses,
      ...rest
    } = props;

    const { classes, cx } = useStyles({ color, defaultCheckedIconColor });

    const edges = Array.isArray(edge)
      ? edge
      : !commonHelpers.isEmpty(edge)
      ? [edge!]
      : [];

    const rootClasses = cx(classes.root, {
      [classes.edgeStart]: edges.includes("start"),
      [classes.edgeEnd]: edges.includes("end"),
      [classes.edgeTop]: edges.includes("top"),
      [classes.edgeBottom]: edges.includes("bottom"),
      [classes.edgeX]: edges.includes("x"),
      [classes.edgeY]: edges.includes("y"),
      [classes.edgeXY]: edges.includes("xy"),
    });

    return (
      <Checkbox
        classes={{
          ...muiClasses,
          root: cx(rootClasses, muiClasses?.root),
          checked: cx(classes.checked, muiClasses?.checked),
          indeterminate: cx(classes.indeterminate, muiClasses?.indeterminate),
        }}
        ref={ref}
        icon={<AppSvgIcon className={classes.icon} component={UncheckedIcon} />}
        checkedIcon={
          <AppSvgIcon
            className={cx(classes.icon, classes.checkedIcon)}
            component={CheckedIcon}
          />
        }
        indeterminateIcon={
          <AppSvgIcon
            className={classes.icon}
            component={IndeterminateCheckBoxIcon}
          />
        }
        {...rest}
        size="medium"
      />
    );
  }
);

export default AppCheckbox;
