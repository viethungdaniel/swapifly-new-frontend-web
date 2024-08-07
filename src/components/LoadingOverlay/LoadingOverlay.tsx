import { ForwardedRef, forwardRef } from "react";

import { Box, Typography } from "@mui/material";
import AppLoading from "@/components/AppLoading";

import useStyles from "./LoadingOverlay.styles";

import type { BoxProps } from "@mui/material";

type LoadingOverlayProps<D extends React.ElementType = "div", P = {}> = {
  showOnLoading?: boolean;
  loading?: boolean;
  loadingText?: string;
  keepMounted?: boolean;
} & BoxProps<D, P>;

const LoadingOverlay = forwardRef(
  <D extends React.ElementType = "div", P = {}>(
    props: LoadingOverlayProps<D, P>,
    ref: ForwardedRef<any>
  ) => {
    const {
      loading = false,
      loadingText,
      keepMounted,
      children,
      className,
      showOnLoading,
      ...rest
    } = props;

    const { classes, cx } = useStyles();

    return (
      <Box
        ref={ref}
        className={cx(
          classes.root,
          {
            [`${classes.loading}`]: loading,
            [`${classes.loadingContentHidden}`]: loading && !showOnLoading,
          },
          !!className && className
        )}
        {...rest}
      >
        {loading && (
          <div className={classes.loadingContent}>
            <AppLoading variant="circular" size={40} />
            {!!loadingText && (
              <Typography color="inherit">{loadingText}</Typography>
            )}
          </div>
        )}
        {(!loading || (!!loading && !!keepMounted)) && children}
      </Box>
    );
  }
);

export default LoadingOverlay;
