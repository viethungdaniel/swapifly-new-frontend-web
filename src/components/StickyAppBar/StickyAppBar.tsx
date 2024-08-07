import { AppBar } from "@mui/material";

import {
  cloneElement,
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { useEventCallback, useEventListener } from "@/hooks";

import useStyles from "./StickyAppBar.styles";

import type { OverridableComponent } from "@mui/material/OverridableComponent";
import type { AppBarProps } from "@mui/material";

type CustomStickyAppBarProps = {
  thresholdTopEle?: string;
};

type StickyAppBarProps = Omit<AppBarProps, keyof CustomStickyAppBarProps> &
  CustomStickyAppBarProps;

type StickyAppBarTypeMap<P = {}, D extends React.ElementType = "span"> = {
  props: P & StickyAppBarProps;
  defaultComponent: D;
};
type StickyAppBarComponent = OverridableComponent<StickyAppBarTypeMap>;

const ElevationScroll = forwardRef(
  (props: StickyAppBarProps, ref: React.ForwardedRef<any>) => {
    const {
      children,
      classes: muiClasses,
      className,
      thresholdTopEle,
      sx,
      ...rest
    } = props;

    const [topEleThreshold, setTopEleThreshold] = useState(0);
    const [sticking, setSticking] = useState(false);

    const appBarRef = useRef<HTMLDivElement>(null!);

    const { classes, theme, css, cx } = useStyles();

    const handleStickyStateUpdate = useEventCallback(() => {
      let newAppBarDistanceFromTop = 0;
      let newTopEleThreshold = 0;
      if (!!thresholdTopEle) {
        const selectedThresholdTopEle = document.querySelector(thresholdTopEle);
        if (!!selectedThresholdTopEle) {
          const { height } = selectedThresholdTopEle.getBoundingClientRect();
          newTopEleThreshold = Math.round(height);
        }
      }

      if (!!appBarRef.current) {
        const { height, bottom } = appBarRef.current.getBoundingClientRect();
        newAppBarDistanceFromTop = Math.round(bottom - height);
      }
      setSticking(newAppBarDistanceFromTop - newTopEleThreshold <= 0);
      if (newTopEleThreshold < 0) return;
      // setTopEleThreshold((prevTopEleThreshold) =>
      //   [0, 1].includes(newTopEleThreshold - prevTopEleThreshold)
      //     ? prevTopEleThreshold
      //     : newTopEleThreshold
      // );
      setTopEleThreshold(newTopEleThreshold);
    });

    useEventListener("scroll", handleStickyStateUpdate);

    useImperativeHandle(ref, () => appBarRef.current);

    useEffect(() => {
      if (!thresholdTopEle) return;
      const selectedThresholdTopEle = document.querySelector(thresholdTopEle);
      if (selectedThresholdTopEle) {
        const resizeObserverThresholdTopEle = new ResizeObserver(
          handleStickyStateUpdate
        );
        resizeObserverThresholdTopEle.observe(selectedThresholdTopEle);

        return () => {
          resizeObserverThresholdTopEle.disconnect();
        };
      }
      return;
    }, [thresholdTopEle]);

    useEffect(() => {
      const appBarEl = appBarRef.current;
      if (!appBarEl) return;
      const resizeObserverAppBar = new ResizeObserver(handleStickyStateUpdate);
      resizeObserverAppBar.observe(appBarEl);

      return () => {
        resizeObserverAppBar.disconnect();
      };
    }, []);

    return cloneElement(
      children as any,
      {
        ref: appBarRef,
        elevation: sticking ? 4 : 0,
        color: "transparent",
        position: "sticky",
        classes: {
          ...muiClasses,
          root: cx(
            classes.root,
            sticking && classes?.sticking,
            className,
            sx && css(theme.unstable_sx(sx) as any)
          ),
        },
        ...rest,
        style: {
          top: topEleThreshold,
          ...rest.style,
        },
      } as AppBarProps
    );
  }
);

const StickyAppBar: StickyAppBarComponent = forwardRef(
  (props: StickyAppBarProps, ref: React.ForwardedRef<any>) => {
    const { children, ...rest } = props;

    return (
      <ElevationScroll ref={ref} {...rest}>
        <AppBar component="div">{children}</AppBar>
      </ElevationScroll>
    );
  }
);

export default StickyAppBar;
