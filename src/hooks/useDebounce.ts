import { useEffect, useState } from "react";

export default function useDebounce<T>(val: T, delay: number): T {
  const [debounceValue, setDebounceValue] = useState(val)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebounceValue(val)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [val, delay])

  return debounceValue
}