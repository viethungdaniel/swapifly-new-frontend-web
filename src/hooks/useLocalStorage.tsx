import { useCallback, useState } from "react";
import _isEqual from "lodash/isEqual";

import { storageService } from "@/services";

export type UseLocalStorage<T = any> = {
  key: string;
  initialValue: T;
};

const useLocalStorage = <T extends any = any>(
  props: UseLocalStorage<T>
): [T, (value: T) => void] => {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const { key, initialValue } = props;

  const [storedValue, setStoredValue] = useState<T>(
    () => storageService.getLocalItem<T>(key) || initialValue
  );

  // Return a wrapped version of useState's setter function that ...
  // ... persists the new value to localStorage.
  const setValue = useCallback(
    (value: T) => {
      if (!_isEqual(storedValue, value)) {
        setStoredValue(value);
        storageService.saveLocalItem(key, value);
      }
    },
    [key, storedValue]
  );

  return [storedValue, setValue];
};

export default useLocalStorage;
