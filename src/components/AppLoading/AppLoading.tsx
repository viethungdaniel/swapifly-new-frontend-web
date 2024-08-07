import { Box, BoxProps } from "@mui/material";
import LogoSvg from "@@/public/images/logo.svg";
import AppSvgIcon from "@/components/AppSvgIcon";

import { forwardRef } from "react";

import useStyles from "./AppLoading.styles";

import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomAppLoadingProps = {
  size?: SafeNumber | `${number}px`;
  color?: "primary" | "secondary" | "error" | "blueGradient" | AppThemeColor;
  variant?: "circular" | "circularLogo";
};

export type AppLoadingProps = Omit<BoxProps, keyof CustomAppLoadingProps> &
  CustomAppLoadingProps;

type AppLoadingTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & AppLoadingProps;
  defaultComponent: D;
};
type AppLoadingComponent = OverridableComponent<AppLoadingTypeMap>;

const AppLoading: AppLoadingComponent = forwardRef(
  (props: AppLoadingProps, ref: React.ForwardedRef<any>) => {
    const {
      className,
      color = "blueGradient",
      sx,
      size = 100,
      variant = "circular",
      ...rest
    } = props;

    const { classes, theme, css, cx } = useStyles({ color, size });

    return (
      <Box
        ref={ref}
        {...rest}
        className={cx(
          classes.root,
          className,
          variant === "circularLogo" && classes.circularLogo,
          sx && css(theme.unstable_sx(sx) as any)
        )}
      >
        {variant === "circularLogo" && (
          <>
            <span className={classes.circularProgress}>
              <svg
                className={classes.circularProgressSvg}
                fill="none"
                viewBox="22 22 44 44"
              >
                <circle
                  cx="44"
                  cy="44"
                  r="20.2"
                  fill="none"
                  strokeWidth="3.6"
                ></circle>
                <defs>
                  <linearGradient id="blueGradient">
                    <stop offset="0%" stopColor="#FF3992" />
                    <stop offset="0%" stopColor="#FF3992" />
                    <stop offset="100%" stopColor="#5072EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
            <span className={classes.logo}>
              <AppSvgIcon className={classes.logoSvg} component={LogoSvg} />
            </span>
          </>
        )}
        {variant === "circular" && (
          <>
            <span className={classes.circularProgress}>
              <svg
                className={classes.circularProgressSvg}
                fill="none"
                viewBox="22 22 44 44"
              >
                <circle
                  cx="44"
                  cy="44"
                  r="20.2"
                  fill="none"
                  strokeWidth="3.6"
                ></circle>
                <defs>
                  <linearGradient id="blueGradient">
                    <stop offset="0%" stopColor="#FF3992" />
                    <stop offset="0%" stopColor="#FF3992" />
                    <stop offset="100%" stopColor="#5072EE" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </>
        )}
      </Box>
    );
  }
);

export default AppLoading;
