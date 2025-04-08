import { gamesI } from "@/shared";
import { useState, useEffect } from "react";

function useLocalStorage<T>(
  key: string,
  initialValue: T,
  shouldApplyInitialValue?: (storedValue: T) => boolean
) {
  const [value, setValue] = useState<T>(() => {
    const storedValue = localStorage.getItem(key) as string;
    if (shouldApplyInitialValue) {
      return shouldApplyInitialValue(JSON.parse(storedValue))
        ? JSON.parse(storedValue)
        : initialValue;
    } else {
      return storedValue ? JSON.parse(storedValue) : initialValue;
    }
  });

  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        setValue(e.newValue ? JSON.parse(e.newValue) : initialValue);
      }
    };

    window.addEventListener("storage", handleStorageChange);

    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [key, initialValue]);

  const updateValue = (newValue: T) => {
    setValue(newValue);
    localStorage.setItem(key, JSON.stringify(newValue));
  };

  return [value, updateValue] as [T, (newValue: T) => void];
}

export default useLocalStorage;
