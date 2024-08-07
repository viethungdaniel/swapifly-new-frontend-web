import { forwardRef } from "react";

import { Chip } from "@mui/material";
import AppSvgIcon from "@/components/AppSvgIcon";
import CloseIcon from "@@/public/images/icons/close.svg";

import useStyles from "./AppChip.styles";

import type { ChipProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type ChipColor = "default" | AppThemeColor;
type ChipTextColor = "default" | "textPrimary" | AppThemeColor;

export type CustomChipProps = {
  color?: ChipColor;
  textColor?: ChipTextColor;
  variant?: ChipProps["variant"] | "filledTonal";
  borderRadius?: "rounded" | "circular";
};

export type AppChipProps = CustomChipProps &
  Omit<ChipProps, keyof CustomChipProps>;

type AppChipTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppChipProps;
  defaultComponent: D;
};
type AppChipComponent = OverridableComponent<AppChipTypeMap>;

const AppChip: AppChipComponent = forwardRef(
  (props: AppChipProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      classes: muiClasses,
      color = "default",
      textColor = "default",
      variant,
      borderRadius = "circular",
      ...rest
    } = props;

    const { classes, cx } = useStyles({
      color: color as string,
      textColor: textColor as string,
    });

    return (
      <Chip
        ref={ref}
        classes={{
          ...muiClasses,
          label: cx(classes.label, muiClasses?.label),
          deleteIcon: cx(classes.deleteIcon, muiClasses?.deleteIcon),
          avatarMedium: cx(classes.avatarMedium, muiClasses?.avatarMedium),
          iconMedium: cx(classes.iconMedium, muiClasses?.iconMedium),
          root: cx(
            classes.root,
            muiClasses?.root,
            borderRadius === "rounded" && classes.borderRadiusRounded,
            className
          ),
          sizeMedium: cx(classes.sizeMedium, muiClasses?.sizeMedium),
          labelMedium: cx(classes.labelMedium, muiClasses?.labelMedium),
          sizeSmall: cx(classes.sizeSmall, muiClasses?.sizeSmall),
          labelSmall: cx(classes.labelSmall, muiClasses?.labelSmall),
          filled: cx(classes.filled, muiClasses?.filled, {
            [classes.filledTonal]: variant === "filledTonal",
          }),
          outlined: cx(classes.outlined, muiClasses?.outlined),
          clickable: cx(classes.clickable, muiClasses?.clickable),
        }}
        deleteIcon={<AppSvgIcon component={CloseIcon} fontSize="inherit" />}
        {...rest}
        variant={variant === "filledTonal" ? "filled" : variant}
      />
    );
  }
);

export default AppChip;
