import { DependencyList, useRef } from "react";
import useDeepCompareEffect from "./useDeepCompareEffect";

const useMemoCompare = <T,>(
  factory: () => T,
  deps: DependencyList | undefined
) => {
  const factoryRef = useRef(factory);

  useDeepCompareEffect(() => {
    factoryRef.current = factory;
  }, deps);

  return factoryRef.current();
};

export default useMemoCompare;
