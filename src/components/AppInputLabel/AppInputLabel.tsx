import { forwardRef } from "react";

import { InputLabel } from "@mui/material";

import useStyles from "./AppInputLabel.styles";

import type { InputLabelProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type LabelColor =
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary"
  | "inherit"
  | AppThemeColor;

type CustomInputLabelProps = {
  color?: LabelColor;
};

export type AppInputLabelProps = Omit<
  InputLabelProps,
  keyof CustomInputLabelProps
> &
  CustomInputLabelProps;

type AppInputLabelTypeMap<P = {}, D extends React.ElementType = "label"> = {
  props: P & AppInputLabelProps;
  defaultComponent: D;
};
type AppInputLabelComponent = OverridableComponent<AppInputLabelTypeMap>;

const AppInputLabel: AppInputLabelComponent = forwardRef(
  (props: AppInputLabelProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      classes: muiClasses,
      color = "textPrimary",
      ...rest
    } = props;

    const { classes, cx } = useStyles({ color });

    return (
      <InputLabel
        ref={ref}
        shrink
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(classes.root, muiClasses?.root, className),
          focused: cx(classes.focused, muiClasses?.focused),
          error: cx(classes.error, muiClasses?.error),
          asterisk: cx(classes.asterisk, muiClasses?.asterisk),
        }}
      />
    );
  }
);

export default AppInputLabel;
