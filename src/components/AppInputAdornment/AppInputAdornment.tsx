import { forwardRef, isValidElement } from "react";

import { InputAdornment } from "@mui/material";

import useStyles from "./AppInputAdornment.styles";

import type { InputAdornmentProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import AppTypography from "@/components/AppTypography";

export type AppInputAdornmentProps = InputAdornmentProps;

type AppInputAdornmentTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppInputAdornmentProps;
  defaultComponent: D;
};
type AppInputAdornmentComponent =
  OverridableComponent<AppInputAdornmentTypeMap>;

const AppInputAdornment: AppInputAdornmentComponent = forwardRef(
  (props: AppInputAdornmentProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      classes: muiClasses,
      children,
      disableTypography,
      sx,
      ...rest
    } = props;

    const { classes, theme, cx, css } = useStyles();

    const isChildrenElement =
      Array.isArray(children) || isValidElement(children);

    return (
      <InputAdornment
        ref={ref}
        {...rest}
        disableTypography
        classes={{
          ...muiClasses,
          root: cx(
            muiClasses?.root,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
          positionStart: cx(classes.positionStart, muiClasses?.positionStart),
          positionEnd: cx(classes.positionEnd, muiClasses?.positionEnd),
        }}
      >
        {disableTypography || isChildrenElement ? (
          children
        ) : (
          <AppTypography variant="bodyReg14" component="div">
            {children}
          </AppTypography>
        )}
      </InputAdornment>
    );
  }
);

export default AppInputAdornment;
