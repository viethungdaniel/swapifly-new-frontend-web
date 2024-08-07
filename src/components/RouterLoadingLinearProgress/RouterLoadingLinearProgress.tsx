import { useEffect, useRef, useState } from "react";

import { LinearProgress } from "@mui/material";

import { useRouter } from "next/router";
import { useEventCallback } from "@/hooks";

import useStyles from "./RouterLoadingLinearProgress.styles";

const RouterLoadingLinearProgress = () => {
  const [progress, setProgress] = useState(0);
  const [progressBarShow, setProgressBarShow] = useState(false);

  const startTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { classes } = useStyles();

  const router = useRouter();

  const handleHashChangeStart = useEventCallback(() => {
    clearTimeout(startTimeoutRef.current!);
    setProgress(100);
  });

  const handleHashChangeComplete = useEventCallback(() => {
    clearTimeout(startTimeoutRef.current!);
    setProgress(100);
  });

  const handleRouteChangeError = useEventCallback(() => {
    clearTimeout(startTimeoutRef.current!);
    setProgress(100);
  });

  const handleRouteChangeStart = useEventCallback(
    (_: string, options: { shallow: boolean }) => {
      setProgressBarShow(false);
      setProgress(0);
      clearTimeout(startTimeoutRef.current!);
      if (options.shallow) return;
      startTimeoutRef.current = setTimeout(() => {
        setProgress(0);
        setProgressBarShow(true);
      }, 500);
    }
  );

  const handleRouteChangeComplete = useEventCallback(() => {
    clearTimeout(startTimeoutRef.current!);
    setProgress(100);
  });

  useEffect(() => {
    if (progress === 100) {
      const timer = setInterval(() => {
        setProgressBarShow(false);
      }, 500);
      return () => {
        clearInterval(timer);
      };
    }
  }, [progress]);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) return oldProgress;
        const diff = Math.random() * 10;
        return Math.min(oldProgress + diff, 99);
      });
    }, 500);

    router.events.on("hashChangeStart", handleHashChangeStart);
    router.events.on("hashChangeComplete", handleHashChangeComplete);
    router.events.on("routeChangeStart", handleRouteChangeStart);
    router.events.on("routeChangeComplete", handleRouteChangeComplete);
    router.events.on("routeChangeError", handleRouteChangeError);

    return () => {
      clearInterval(timer);
      clearTimeout(startTimeoutRef.current!);
      router.events.off("hashChangeStart", handleHashChangeStart);
      router.events.off("hashChangeComplete", handleHashChangeComplete);
      router.events.off("routeChangeStart", handleRouteChangeStart);
      router.events.off("routeChangeComplete", handleRouteChangeComplete);
      router.events.off("routeChangeError", handleRouteChangeError);
    };
  }, []);

  if (!progressBarShow) return null;

  return (
    <LinearProgress
      className={classes.root}
      variant="determinate"
      value={progress}
    />
  );
};

export default RouterLoadingLinearProgress;
