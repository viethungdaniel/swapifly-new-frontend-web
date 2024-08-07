import { forwardRef } from "react";

import { Typography } from "@mui/material";

import type { TypographyProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomTypographyProps = {
  color?: AppThemeColor;
};

export type AppTypographyProps = Omit<
  TypographyProps,
  keyof CustomTypographyProps
> &
  CustomTypographyProps;

interface AppTypographyTypeMap<P = {}, D extends React.ElementType = "span"> {
  props: P & AppTypographyProps;
  defaultComponent: D;
}

type AppTypographyComponent = OverridableComponent<AppTypographyTypeMap>;

const AppTypography: AppTypographyComponent = forwardRef(
  (props: AppTypographyProps, ref: React.ForwardedRef<any>) => {
    return <Typography ref={ref} {...props} />;
  }
);

export default AppTypography;
