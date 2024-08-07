import { forwardRef } from "react";

import { Tooltip } from "@mui/material";

import useStyles from "./AppTooltip.styles";

import type { TooltipProps } from "@mui/material";

type CustomTooltipProps = {};

export type AppTooltipProps = CustomTooltipProps &
  Omit<TooltipProps, keyof CustomTooltipProps>;

const AppTooltip = forwardRef(
  (props: AppTooltipProps, ref: React.ForwardedRef<any>) => {
    const { classes: muiClasses, ...rest } = props;

    const { classes, cx } = useStyles();

    return (
      <Tooltip
        ref={ref}
        {...rest}
        classes={{
          ...muiClasses,
          tooltip: cx(classes.tooltip, muiClasses?.tooltip),
        }}
      />
    );
  }
);

export default AppTooltip;
