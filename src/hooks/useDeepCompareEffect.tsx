import _isEqual from "lodash/isEqual";
import { useEffect, useRef } from "react";

const deepCompareEquals = <A, B>(a: A, b: B) => {
  // TODO: implement deep comparison here
  // something like lodash
  return _isEqual(a, b);
};

const useDeepCompareMemoize = <V,>(value: V) => {
  const ref = useRef<V>();
  // it can be done by using useMemo as well
  // but useRef is rather cleaner and easier

  if (!deepCompareEquals(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
};

const useDeepCompareEffect = <
  C extends Parameters<typeof useEffect>[0],
  D extends Parameters<typeof useEffect>[1]
>(
  callback: C,
  dependencies: D
) => {
  useEffect(
    callback,
    !!dependencies ? dependencies.map(useDeepCompareMemoize) : undefined
  );
};

export default useDeepCompareEffect;
