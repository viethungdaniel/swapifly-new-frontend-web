import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppTextFieldGroup.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomBoxProps = {
  borderRadius?: "rounded" | "circular";
  fullWidth?: boolean;
};

type AppTextFieldGroupProps = Omit<BoxProps, keyof CustomBoxProps> &
  CustomBoxProps;
interface AppTextFieldGroupTypeMap<
  P = {},
  D extends React.ElementType = "div"
> {
  props: P & AppTextFieldGroupProps;
  defaultComponent: D;
}

type AppTextFieldGroupComponent =
  OverridableComponent<AppTextFieldGroupTypeMap>;

const AppTextFieldGroup: AppTextFieldGroupComponent = forwardRef(
  (props: AppTextFieldGroupProps, ref: React.ForwardedRef<any>) => {
    const { className, borderRadius, fullWidth, ...rest } = props;
    const { classes, cx } = useStyles();

    return (
      <Box
        ref={ref}
        {...rest}
        className={cx(
          classes.root,
          {
            [classes.borderRadiusCircular]: borderRadius === "circular",
            [classes.fullWidth]: !!fullWidth,
          },
          className
        )}
      />
    );
  }
);

export default AppTextFieldGroup;
