import { useState, useEffect } from 'react';

/**
 * Delays state updates to prevent excessive, rapid API calls during search input typing.
 */
export function useDebounce<T>(inputValue: T, cooldownDelayMs: number = 400): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(inputValue);

  useEffect(() => {
    // Initialize a timed delay trigger task
    const timerTrackerId = setTimeout(() => {
      setDebouncedValue(inputValue);
    }, cooldownDelayMs);

    // Wipe out active timers instantly if inputs shift before the cooldown delay ends
    return () => {
      clearTimeout(timerTrackerId);
    };
  }, [inputValue, cooldownDelayMs]);

  return debouncedValue;
}