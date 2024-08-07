import _debounce from "lodash/debounce";

import { useCallback, useEffect } from "react";
import useEventCallback from "./useEventCallback";

const useDebouncedCallback = <Fn extends (...args: any) => any>(
  callback: Fn,
  ms: number
) => {
  const executeCallback = useEventCallback(callback);

  const debouncedCallback = useCallback(_debounce(executeCallback, ms), [ms]);

  useEffect(() => {
    return () => {
      debouncedCallback.cancel();
    };
  }, [debouncedCallback]);

  return debouncedCallback;
};

export default useDebouncedCallback;
