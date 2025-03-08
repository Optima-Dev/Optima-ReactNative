import { useState, useEffect } from "react";

export default function useDebounce(callback, delay) {
  const [debouncedValue, setDebouncedValue] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      callback(debouncedValue);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, delay, callback]);

  return setDebouncedValue;
}
