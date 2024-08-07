import React, { forwardRef, useMemo } from "react";

import { Box, Grid, Skeleton } from "@mui/material";

import useStyles from "./LoadingSkeleton.styles";

import type { BoxProps, GridProps, SkeletonProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";
import ProductCard from "@/containers/ProductCard";

type CustomLoadingSkeletonProps = {
  loading?: boolean;
  variant?:
    | "custom"
    | "default"
    | "userLabel"
    | "banner"
    | "standardProductCard"
    | "filledProductCard";
  customSkeleton?: React.ReactNode;
  count?: number;
  GridContainerProps?: Omit<GridProps, "container">;
  GridItemProps?: Omit<GridProps, "item">;
  SkeletonProps?: SkeletonProps;
  keepMounted?: boolean;
  classes?: Partial<ReturnType<typeof useStyles>["classes"]>;
};

type LoadingSkeletonProps = Omit<BoxProps, keyof CustomLoadingSkeletonProps> &
  CustomLoadingSkeletonProps;

type LoadingSkeletonTypeMap<P = {}, D extends React.ElementType = "div"> = {
  props: P & LoadingSkeletonProps;
  defaultComponent: D;
};
type LoadingSkeletonComponent = OverridableComponent<LoadingSkeletonTypeMap>;

const LoadingSkeleton: LoadingSkeletonComponent = forwardRef(
  (props: LoadingSkeletonProps, ref: React.ForwardedRef<any>) => {
    const {
      loading = false,
      keepMounted,
      children,
      className,
      variant = "userLabel",
      count = 1,
      GridContainerProps,
      GridItemProps,
      SkeletonProps,
      customSkeleton,
      classes: appClasses,
      ...rest
    } = props;

    const items = useMemo(() => {
      return [...Array.from(Array(count)).keys()];
    }, [count]);

    const { classes, cx } = useStyles(undefined, {
      props: { classes: appClasses },
    });

    return (
      <Box
        ref={ref}
        className={cx(
          classes.root,
          loading && classes.hidden,
          !!className && className
        )}
        {...rest}
      >
        {(!loading || !!keepMounted) && (
          <Box
            display={!!loading ? "none" : "block"}
            className={classes.content}
          >
            {children}
          </Box>
        )}
        {loading && (
          <Grid container {...GridContainerProps}>
            {items.map((index) => (
              <Grid key={index} item xs {...GridItemProps}>
                {variant === "custom" && customSkeleton}
                {variant === "userLabel" && (
                  <Skeleton
                    variant="rounded"
                    animation="wave"
                    height={60}
                    {...SkeletonProps}
                  />
                )}
                {variant === "banner" && (
                  <div className={classes.banner}>
                    <Skeleton
                      variant="rectangular"
                      animation="wave"
                      {...SkeletonProps}
                      className={classes.bannerSkeleton}
                    />
                  </div>
                )}
                {variant === "default" && (
                  <Skeleton animation="wave" {...SkeletonProps} />
                )}
                {variant === "standardProductCard" && (
                  <ProductCard variant="standard" skeletonLoading />
                )}
                {variant === "filledProductCard" && (
                  <ProductCard variant="filled" skeletonLoading />
                )}
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    );
  }
);

export default LoadingSkeleton;
