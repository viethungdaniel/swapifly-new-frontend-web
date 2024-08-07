import { forwardRef } from "react";

import { Paper } from "@mui/material";

import useStyles from "./AppPaper.styles";

import type { PaperProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomPaperProps = {
  boxShadowVariant?: "menuPopper" | "card";
};

export type AppPaperProps = Omit<PaperProps, keyof CustomPaperProps> &
  CustomPaperProps;

type AppPaperTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppPaperProps;
  defaultComponent: D;
};
type AppPaperComponent = OverridableComponent<AppPaperTypeMap>;

const AppPaper: AppPaperComponent = forwardRef(
  (props: AppPaperProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      classes: muiClasses,
      boxShadowVariant,
      sx,
      ...rest
    } = props;

    const { classes, theme, cx, css } = useStyles();

    return (
      <Paper
        ref={ref}
        classes={{
          ...muiClasses,
          root: cx(
            classes.root,
            {
              [classes.boxShadowMenuPopper]: boxShadowVariant === "menuPopper",
              [classes.boxShadowCard]: boxShadowVariant === "card",
            },
            muiClasses?.root,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        }}
        elevation={0}
        {...rest}
      />
    );
  }
);

export default AppPaper;
