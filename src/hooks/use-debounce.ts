"use client";

import { useEffect, useState } from "react";

/**
 * useDebounce hook
 * Delays updating the value until after the specified delay has passed.
 * Useful for debouncing search inputs or API calls.
 */
export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timer);
        };
    }, [value, delay]);

    return debouncedValue;
}
