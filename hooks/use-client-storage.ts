"use client";

import { useEffect, useState } from "react";

export function useClientStorage(key: string, defaultValue = "") {
  const [value, setValue] = useState(defaultValue);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      setValue(storedValue);
    }
  }, [key]);

  const setStoredValue = (newValue: string) => {
    setValue(newValue);
    if (isClient) {
      localStorage.setItem(key, newValue);
    }
  };

  const removeStoredValue = () => {
    setValue(defaultValue);
    if (isClient) {
      localStorage.removeItem(key);
    }
  };

  return {
    value,
    setValue: setStoredValue,
    removeValue: removeStoredValue,
    isClient,
  };
}
