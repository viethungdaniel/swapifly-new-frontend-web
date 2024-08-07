import { forwardRef, useRef } from "react";

import { Box } from "@mui/material";

import { useEventListener } from "@/hooks";

import type { BoxProps } from "@mui/material";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomWindowInfiniteScrollLoaderProps = {
  hasNextPage?: boolean;
  onNextPageLoad?: () => void;
  threshold?: number;
};

export type WindowInfiniteScrollLoaderProps = Omit<
  BoxProps,
  keyof CustomWindowInfiniteScrollLoaderProps
> &
  CustomWindowInfiniteScrollLoaderProps;

type WindowInfiniteScrollLoaderTypeMap<
  P = {},
  D extends React.ElementType = "div"
> = {
  props: P & WindowInfiniteScrollLoaderProps;
  defaultComponent: D;
};
type WindowInfiniteScrollLoaderComponent =
  OverridableComponent<WindowInfiniteScrollLoaderTypeMap>;

const WindowInfiniteScrollLoader: WindowInfiniteScrollLoaderComponent =
  forwardRef(
    (props: WindowInfiniteScrollLoaderProps, ref: React.ForwardedRef<any>) => {
      const {
        hasNextPage = true,
        children,
        threshold = 0,
        onNextPageLoad,
        ...rest
      } = props;

      const loaderElRef = useRef<HTMLDivElement>(null!);

      const handleWindowScroll = () => {
        const loaderEl = loaderElRef.current;
        if (!loaderEl || !hasNextPage) return;
        const loaderElLoadingClientRect = loaderEl.getBoundingClientRect();

        if (loaderElLoadingClientRect.top <= window.innerHeight + threshold) {
          loaderEl.click();
        }
      };

      useEventListener("scroll", handleWindowScroll);

      return (
        <Box ref={ref} {...rest}>
          {children}
          <div ref={loaderElRef} onClick={onNextPageLoad}></div>
        </Box>
      );
    }
  );

export default WindowInfiniteScrollLoader;
