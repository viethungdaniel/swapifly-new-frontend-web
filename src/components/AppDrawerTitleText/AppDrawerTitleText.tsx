import { forwardRef } from "react";

import { Typography } from "@mui/material";

import useStyles from "./AppDrawerTitleText.styles";

import type { TypographyProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type AppDrawerTitleTextProps = TypographyProps;

type AppDrawerTitleTextTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppDrawerTitleTextProps;
  defaultComponent: D;
};
type AppDrawerTitleTextComponent =
  OverridableComponent<AppDrawerTitleTextTypeMap>;

const AppDrawerTitleText: AppDrawerTitleTextComponent = forwardRef(
  (props: AppDrawerTitleTextProps, ref: React.ForwardedRef<any>) => {
    const { className, children, component = "div", ...rest } = props;

    const { classes } = useStyles();

    return (
      <Typography
        ref={ref}
        variant="bodyMed16"
        className={classes.root}
        noWrap
        component={component}
        {...rest}
      >
        {children}
      </Typography>
    );
  }
);

export default AppDrawerTitleText;
