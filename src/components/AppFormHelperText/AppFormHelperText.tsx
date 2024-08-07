import { forwardRef } from "react";

import { FormHelperText } from "@mui/material";

import useStyles from "./AppFormHelperText.styles";

import type { FormHelperTextProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type FormHelperTextColor =
  | "primary"
  | "secondary"
  | "textPrimary"
  | "textSecondary"
  | AppThemeColor;

type CustomFormHelperTextProps = {
  color?: FormHelperTextColor;
};

export type AppFormHelperTextProps = Omit<
  FormHelperTextProps,
  keyof CustomFormHelperTextProps
> &
  CustomFormHelperTextProps;

type AppFormHelperTextTypeMap<P = {}, D extends React.ElementType = "p"> = {
  props: P & AppFormHelperTextProps;
  defaultComponent: D;
};
type AppFormHelperTextComponent =
  OverridableComponent<AppFormHelperTextTypeMap>;

const AppFormHelperText: AppFormHelperTextComponent = forwardRef(
  (props: AppFormHelperTextProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      classes: muiClasses,
      color = "textPrimary",
      sx,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles({ color });

    return (
      <FormHelperText
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            muiClasses?.root,
            !!sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
      />
    );
  }
);

export default AppFormHelperText;
