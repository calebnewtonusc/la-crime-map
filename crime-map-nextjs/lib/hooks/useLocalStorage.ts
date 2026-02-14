'use client'

import { useState, useEffect, useCallback, useRef } from 'react'

/**
 * Type-safe localStorage hook with SSR support
 * Handles JSON serialization/deserialization automatically
 * Syncs state across tabs/windows using storage events
 */

export type UseLocalStorageOptions<T> = {
  /** Serialize function for custom serialization */
  serializer?: (value: T) => string
  /** Deserialize function for custom deserialization */
  deserializer?: (value: string) => T
  /** Initialize state even during SSR (default: false) */
  initializeOnServer?: boolean
  /** Sync across tabs/windows (default: true) */
  syncTabs?: boolean
}

export type SetValue<T> = (value: T | ((prevValue: T) => T)) => void

/**
 * Custom hook for managing localStorage with React state
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value (fallback if key doesn't exist)
 * @param options - Configuration options
 * @returns [storedValue, setValue, removeValue]
 *
 * @example
 * ```tsx
 * const [theme, setTheme, removeTheme] = useLocalStorage('theme', 'light')
 * const [preferences, setPreferences] = useLocalStorage('prefs', { metric: 'violentCrime' })
 * ```
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T,
  options?: UseLocalStorageOptions<T>
): [T, SetValue<T>, () => void] {
  const {
    serializer = JSON.stringify,
    deserializer = JSON.parse,
    initializeOnServer = false,
    syncTabs = true,
  } = options || {}

  // Track if we're on the client
  const isClient = typeof window !== 'undefined'

  // Use ref to store the event listener handler to avoid re-creating it
  const eventHandlerRef = useRef<((e: StorageEvent) => void) | null>(null)

  // Initialize state
  const [storedValue, setStoredValue] = useState<T>(() => {
    // During SSR, return initial value unless initializeOnServer is true
    if (!isClient) {
      return initializeOnServer ? initialValue : initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      if (item === null) {
        // Key doesn't exist, set it with initial value
        window.localStorage.setItem(key, serializer(initialValue))
        return initialValue
      }
      return deserializer(item)
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Update localStorage when value changes
  const setValue: SetValue<T> = useCallback(
    (value) => {
      if (!isClient) {
        console.warn('Cannot set localStorage value during SSR')
        return
      }

      try {
        // Allow value to be a function for the same API as useState
        const valueToStore = value instanceof Function ? value(storedValue) : value

        setStoredValue(valueToStore)
        window.localStorage.setItem(key, serializer(valueToStore))

        // Dispatch custom event for cross-component sync (within same tab)
        window.dispatchEvent(
          new CustomEvent('local-storage', {
            detail: { key, value: valueToStore },
          })
        )
      } catch (error) {
        console.error(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, serializer, storedValue, isClient]
  )

  // Remove value from localStorage
  const removeValue = useCallback(() => {
    if (!isClient) {
      console.warn('Cannot remove localStorage value during SSR')
      return
    }

    try {
      window.localStorage.removeItem(key)
      setStoredValue(initialValue)

      // Dispatch custom event for cross-component sync
      window.dispatchEvent(
        new CustomEvent('local-storage', {
          detail: { key, value: undefined },
        })
      )
    } catch (error) {
      console.error(`Error removing localStorage key "${key}":`, error)
    }
  }, [key, initialValue, isClient])

  // Sync state across tabs/windows
  useEffect(() => {
    if (!isClient || !syncTabs) return

    const handleStorageChange = (e: StorageEvent | CustomEvent) => {
      // Handle native storage event (cross-tab sync)
      if (e instanceof StorageEvent) {
        if (e.key !== key || e.storageArea !== window.localStorage) return

        try {
          if (e.newValue === null) {
            setStoredValue(initialValue)
          } else {
            setStoredValue(deserializer(e.newValue))
          }
        } catch (error) {
          console.warn(`Error syncing localStorage key "${key}":`, error)
        }
      }
      // Handle custom event (same-tab sync across components)
      else if (e instanceof CustomEvent) {
        const { key: eventKey, value } = e.detail
        if (eventKey !== key) return

        if (value === undefined) {
          setStoredValue(initialValue)
        } else {
          setStoredValue(value)
        }
      }
    }

    // Store handler in ref
    eventHandlerRef.current = handleStorageChange

    // Listen for storage events from other tabs
    window.addEventListener('storage', handleStorageChange)

    // Listen for custom events from same tab
    window.addEventListener('local-storage', handleStorageChange as EventListener)

    return () => {
      window.removeEventListener('storage', handleStorageChange)
      window.removeEventListener('local-storage', handleStorageChange as EventListener)
      eventHandlerRef.current = null
    }
  }, [key, initialValue, deserializer, syncTabs, isClient])

  return [storedValue, setValue, removeValue]
}

/**
 * Hook for managing localStorage with debounced updates
 * Useful for frequently changing values (e.g., form inputs)
 *
 * @param key - The localStorage key
 * @param initialValue - The initial value
 * @param debounceMs - Debounce delay in milliseconds (default: 500)
 * @returns [storedValue, setValue, removeValue]
 */
export function useDebouncedLocalStorage<T>(
  key: string,
  initialValue: T,
  debounceMs: number = 500
): [T, SetValue<T>, () => void] {
  const [value, setValue] = useState<T>(initialValue)
  const [storedValue, setStoredValue, removeValue] = useLocalStorage(key, initialValue)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Update stored value with debounce
  useEffect(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      setStoredValue(value)
    }, debounceMs)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [value, debounceMs, setStoredValue])

  // Sync with stored value on mount
  useEffect(() => {
    setValue(storedValue)
  }, [storedValue])

  return [value, setValue, removeValue]
}
