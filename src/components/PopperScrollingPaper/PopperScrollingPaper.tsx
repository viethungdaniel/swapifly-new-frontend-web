import { forwardRef, useImperativeHandle, useRef } from "react";

import AppPaper from "@/components/AppPaper";

import { useIsomorphicLayoutEffect } from "@/hooks";

import useStyles from "./PopperScrollingPaper.styles";

import type { AppPaperProps } from "@/components/AppPaper";
import type { OverridableComponent } from "@mui/material/OverridableComponent";

type CustomPopperScrollingPaperProps = {};

type PopperScrollingPaperProps = CustomPopperScrollingPaperProps &
  Omit<AppPaperProps, keyof CustomPopperScrollingPaperProps>;

interface PopperScrollingPaperTypeMap<
  P = {},
  D extends React.ElementType = "div"
> {
  props: P & PopperScrollingPaperProps;
  defaultComponent: D;
}
type PopperScrollingPaperComponent =
  OverridableComponent<PopperScrollingPaperTypeMap>;

const PopperScrollingPaper: PopperScrollingPaperComponent = forwardRef(
  (props: PopperScrollingPaperProps, ref: React.ForwardedRef<any>) => {
    const { className, ...rest } = props;

    const rootElRef = useRef<HTMLDivElement>();

    const { classes, cx } = useStyles();

    useIsomorphicLayoutEffect(() => {
      const rootEl = rootElRef.current;
      if (!rootEl) return;
      const updateRootElTimeout = setTimeout(() => {
        const rootElRect = rootEl.getBoundingClientRect();
        rootEl.style.setProperty("--rect-bottom", `${rootElRect.bottom}px`);
        rootEl.style.setProperty("--rect-y", `${rootElRect.y}px`);
      });
      return () => {
        clearTimeout(updateRootElTimeout);
      };
    });

    useImperativeHandle(ref, () => rootElRef.current);

    return (
      <AppPaper
        ref={rootElRef as any}
        {...rest}
        className={cx(classes.root, className)}
      />
    );
  }
);

export default PopperScrollingPaper;
