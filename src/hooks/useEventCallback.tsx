import { useCallback, useEffect, useLayoutEffect, useRef } from "react";

const useIsomorphicLayoutEffect =
  typeof window !== "undefined" ? useLayoutEffect : useEffect;

const useEventCallback = <Fn extends Function>(fn: Fn): Fn => {
  var ref = useRef(fn); // we copy a ref to the callback scoped to the current state/props on each render

  useIsomorphicLayoutEffect(function () {
    ref.current = fn;
  });

  return useCallback(
    function () {
      for (
        var _len = arguments.length, args = new Array(_len), _key = 0;
        _key < _len;
        _key++
      ) {
        args[_key] = arguments[_key];
      }
      return ref.current.apply(void 0, args);
    } as unknown as Fn,
    []
  );
};

export default useEventCallback;
