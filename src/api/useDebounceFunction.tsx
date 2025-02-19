import { useRef } from "react";

// Debounce function
export default function useDebounceFunction<Args extends unknown[]>(
  callback: (...args: Args) => void,
  delay: number
) {
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  return (...args: Args): void => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
