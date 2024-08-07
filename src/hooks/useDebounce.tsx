import { useEffect, useState } from "react"

type UseDebounceProps = {
  value: any
  delay: number
}

const useDebounce = (props: UseDebounceProps) => {
  // State and setters for debounced value
  const { delay, value } = props
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
