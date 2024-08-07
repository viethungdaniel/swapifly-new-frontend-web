import _isEqual from "lodash/isEqual";
import { useContext, useEffect, useRef, useState } from "react";
import type { Context } from "react";

const useContextSelector = <Values, Selector>(
  context: Context<Values>,
  selector: (value: Values) => Selector
) => {
  const { value, registerListener }: any = useContext(context);
  const selectorRef = useRef(selector);
  const [selectedValue, setSelectedValue] = useState(() =>
    selector(value.current)
  );

  useEffect(() => {
    selectorRef.current = selector;
  });

  useEffect(() => {
    const updateValueIfNeeded = (newValue: any) => {
      const newSelectedValue = selectorRef.current(newValue);
      setSelectedValue(() => newSelectedValue);
    };

    const unregisterListener = registerListener(updateValueIfNeeded);

    return unregisterListener;
  }, [registerListener, value]);

  return selectedValue;
};

export default useContextSelector;
