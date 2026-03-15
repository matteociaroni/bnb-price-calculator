import { useEffect, useMemo, useState } from 'react'

/**
 * Parses locale-friendly numeric strings (supports comma decimals, ignores whitespace).
 */
function parseDecimal(raw: string): number {
  const cleaned = raw.trim().replace(/\s+/g, '').replace(',', '.')
  if (!cleaned) return 0
  const n = Number(cleaned)
  return Number.isFinite(n) ? n : 0
}

/**
 * Keeps a string-form numeric input in sync with its parsed numeric value.
 * @param initial default string shown to the user
 */
export function useNumericInput(initial: string, storageKey?: string) {
  const [raw, setRaw] = useState(() => {
    if (!storageKey || typeof window === 'undefined') return initial
    const stored = window.localStorage.getItem(storageKey)
    return stored ?? initial
  })

  useEffect(() => {
    if (!storageKey || typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, raw)
  }, [raw, storageKey])

  const value = useMemo(() => parseDecimal(raw), [raw])

  return { raw, setRaw, value }
}

export function usePersistentState<T>(storageKey: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initial
    const stored = window.localStorage.getItem(storageKey)
    if (stored === null) return initial
    try {
      return JSON.parse(stored) as T
    } catch {
      return initial
    }
  })

  useEffect(() => {
    if (typeof window === 'undefined') return
    window.localStorage.setItem(storageKey, JSON.stringify(value))
  }, [storageKey, value])

  return [value, setValue] as const
}
