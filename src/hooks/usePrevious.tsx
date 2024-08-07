import { useRef, useEffect } from "react";

const usePrevious = <V extends any>(value: V) => {
  const ref = useRef<V>(value);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
