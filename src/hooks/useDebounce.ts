import { useState, useEffect, useRef } from 'react';

/**
 * Debounce a value by `delay` milliseconds.
 */
export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);
  const timerRef = useRef<ReturnType<typeof setTimeout>>();

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);
    return () => clearTimeout(timerRef.current);
  }, [value, delay]);

  return debouncedValue;
}
