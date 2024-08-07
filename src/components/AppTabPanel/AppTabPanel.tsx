import { forwardRef } from "react";

import { Box } from "@mui/material";

import useStyles from "./AppTabPanel.styles";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

export type CustomTabPanelProps = {
  children?: React.ReactNode;
  dir?: string;
  tabIndex: number;
  value: number | string;
  keepMounted?: boolean;
};

export type AppTabPanelProps = Omit<BoxProps, keyof CustomTabPanelProps> &
  CustomTabPanelProps;

interface AppTabPanelTypeMap<P = {}, D extends React.ElementType = "span"> {
  props: P & AppTabPanelProps;
  defaultComponent: D;
}

type AppTabPanelComponent = OverridableComponent<AppTabPanelTypeMap>;

const AppTabPanel: AppTabPanelComponent = forwardRef(
  (props: AppTabPanelProps, ref: React.ForwardedRef<any>) => {
    const {
      value,
      tabIndex,
      dir,
      keepMounted,
      children,
      className,
      sx,
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles();

    return (
      <Box
        ref={ref}
        role="tabpanel"
        hidden={value !== tabIndex}
        aria-labelledby={`full-width-tab-${tabIndex}`}
        {...rest}
        className={cx(
          {
            [classes.hidden]: value !== tabIndex && !!keepMounted,
          },
          className,
          sx && css(theme.unstable_sx(sx) as any)
        )}
      >
        {(value === tabIndex || !!keepMounted) && children}
      </Box>
    );
  }
);

export default AppTabPanel;
