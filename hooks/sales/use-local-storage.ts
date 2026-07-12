'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

export function useLocalStorage<T>(key: string, defaultValue: T): [T, (value: T | ((val: T) => T)) => void] {
  const defaultValueRef = useRef(defaultValue)

  // Read value
  const readValue = useCallback((): T => {
    if (typeof window === 'undefined') {
      return defaultValueRef.current
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? (JSON.parse(item) as T) : defaultValueRef.current
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return defaultValueRef.current
    }
  }, [key])

  const [storedValue, setStoredValue] = useState<T>(defaultValue)
  const storedValueRef = useRef(storedValue)

  // Return a memoized version of useState's setter function that
  // persists the new value to localStorage.
  const setValue = useCallback(
    (value: T | ((val: T) => T)) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore = value instanceof Function ? value(storedValueRef.current) : value

        // Save state
        storedValueRef.current = valueToStore
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
          // Dispatches custom event to sync with other instances on same tab
          window.dispatchEvent(new Event('local-storage'))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key]
  )

  useEffect(() => {
    const value = readValue()
    storedValueRef.current = value
    // Đồng bộ dữ liệu trình duyệt sau khi hydration; giá trị SSR vẫn ổn định.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setStoredValue(value)
  }, [readValue])

  useEffect(() => {
    const handleStorageChange = () => {
      const value = readValue()
      storedValueRef.current = value
      setStoredValue(value)
    }

    if (typeof window !== 'undefined') {
      window.addEventListener('storage', handleStorageChange)
      window.addEventListener('local-storage', handleStorageChange)
    }

    return () => {
      if (typeof window !== 'undefined') {
        window.removeEventListener('storage', handleStorageChange)
        window.removeEventListener('local-storage', handleStorageChange)
      }
    }
  }, [readValue])

  return [storedValue, setValue]
}
