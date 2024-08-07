import { useEffect, useRef, useState } from "react";

import { LinearProgress } from "@mui/material";

import { useIsMounted } from "@/hooks";

import useStyles from "./LoadingLinearProgress.styles";

import type { LinearProgressProps } from "@mui/material";

type CustomLoadingLinearProgressProps = {
  color?: "primary" | "error" | "default" | AppThemeColor;
  loading?: boolean;
};

export type LoadingLinearProgressProps = Omit<
  LinearProgressProps,
  keyof CustomLoadingLinearProgressProps | "value"
> &
  CustomLoadingLinearProgressProps;

const LoadingLinearProgress = (props: LoadingLinearProgressProps) => {
  const { loading, color, className, classes: muiClasses, sx, ...rest } = props;

  const [progress, setProgress] = useState(!!loading ? 0 : 100);
  const [show, setShow] = useState(!!loading);

  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { classes, theme, css, cx } = useStyles({ color });

  useEffect(() => {
    if (progress === 100) {
      const timer = setInterval(() => {
        setShow(false);
      }, 500);
      return () => {
        clearInterval(timer);
      };
    }
    return;
  }, [progress]);

  useEffect(() => {
    if (!isMounted()) return;
    const startProgress = () => {
      setShow(true);
      setProgress(0);
    };
    const endProgress = () => {
      setProgress(100);
    };
    if (!!loading) startProgress();
    else endProgress();
  }, [loading]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return oldProgress;
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 99);
      });
    }, 500);

    return () => {
      clearInterval(timer);
      clearTimeout(startTimeoutRef.current!);
    };
  }, []);

  const isMounted = useIsMounted();

  return (
    <LinearProgress
      variant="determinate"
      {...rest}
      classes={{
        ...muiClasses,
        root: cx(
          classes.root,
          {
            [classes.hidden]: !show,
          },
          muiClasses?.root,
          className,
          sx && css(theme.unstable_sx(sx) as any)
        ),
        bar1Determinate: cx(
          classes.bar1Determinate,
          muiClasses?.bar1Determinate
        ),
      }}
      value={progress}
      color="primary"
    />
  );
};

export default LoadingLinearProgress;
