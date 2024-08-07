import StickyBox from "react-sticky-box";

import { useEffect, useMemo, useState } from "react";

import type { StickyBoxCompProps } from "react-sticky-box";

type CustomAppStickyBoxProps = {
  thresholdTopEle?: string;
};

type AppStickyBoxProps = Omit<
  StickyBoxCompProps,
  keyof CustomAppStickyBoxProps
> &
  CustomAppStickyBoxProps;

const AppStickyBox = (props: AppStickyBoxProps) => {
  const {
    children,
    thresholdTopEle,
    offsetTop: controlledOffsetTop,
    offsetBottom: controlledOffsetBottom,
    ...rest
  } = props;

  const [topEleThreshold, setTopEleThreshold] = useState(0);

  const offsetTop = useMemo(() => {
    return (controlledOffsetTop ?? 0) + topEleThreshold;
  }, [controlledOffsetTop, topEleThreshold]);

  const offsetBottom = useMemo(() => {
    return controlledOffsetBottom ?? 0;
  }, [controlledOffsetBottom]);

  const handleStickyStateUpdate = () => {
    let newTopEleThreshold = 0;
    if (!!thresholdTopEle) {
      const selectedThresholdTopEle = document.querySelector(thresholdTopEle);
      if (!!selectedThresholdTopEle) {
        const { bottom } = selectedThresholdTopEle.getBoundingClientRect();
        newTopEleThreshold = Math.floor(bottom);
      }
    }

    if (newTopEleThreshold < 0) return;
    setTopEleThreshold((prevTopEleThreshold) =>
      [0, 1].includes(newTopEleThreshold - prevTopEleThreshold)
        ? prevTopEleThreshold
        : newTopEleThreshold
    );
  };

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

  return (
    <StickyBox {...rest} offsetTop={offsetTop} offsetBottom={offsetBottom}>
      {children}
    </StickyBox>
  );
};

export default AppStickyBox;
