import { useRef } from "react";

// Debounce function
export default function debounceFunction(callback, delay) {
  const timeoutRef = useRef(null);

  return (...args) => {
    clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      callback(...args);
    }, delay);
  };
}
