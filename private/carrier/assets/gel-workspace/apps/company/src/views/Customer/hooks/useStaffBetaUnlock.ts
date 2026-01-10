import { useEffect, useRef, useState } from 'react'

export interface UseStaffBetaUnlockOptions {
  requiredClicks?: number
  windowMs?: number
}

export function useStaffBetaUnlock(vipType: unknown, options?: UseStaffBetaUnlockOptions) {
  const requiredClicks = options?.requiredClicks ?? 5
  const windowMs = options?.windowMs ?? 2000
  const [unlocked, setUnlocked] = useState(false)
  const [count, setCount] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const windowStartRef = useRef<number | null>(null)

  const isStaff = (() => {
    try {
      const text = String(vipType ?? '').toLowerCase()
      return text.includes('staff')
    } catch {
      return false
    }
  })()

  useEffect(() => {
    if (!isStaff) {
      setUnlocked(false)
      setCount(0)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      windowStartRef.current = null
    }
  }, [isStaff])

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      windowStartRef.current = null
    }
  }, [])

  const onClick = () => {
    try {
      if (!isStaff || unlocked) return
      const now = Date.now()
      if (!count) {
        setCount(1)
        windowStartRef.current = now
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => {
          setCount(0)
          windowStartRef.current = null
        }, windowMs)
        return
      }
      if (windowStartRef.current == null) {
        windowStartRef.current = now
      }
      if (now - windowStartRef.current > windowMs) {
        setCount(1)
        if (timerRef.current) clearTimeout(timerRef.current)
        windowStartRef.current = now
        timerRef.current = setTimeout(() => {
          setCount(0)
          windowStartRef.current = null
        }, windowMs)
        return
      }
      const next = count + 1
      setCount(next)
      if (next >= requiredClicks) {
        setUnlocked(true)
        setCount(0)
        if (timerRef.current) {
          clearTimeout(timerRef.current)
          timerRef.current = null
        }
        windowStartRef.current = null
        return
      }
    } catch {
      setCount(0)
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      windowStartRef.current = null
    }
  }

  const reset = () => {
    setUnlocked(false)
    setCount(0)
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  return { unlocked, onClick, reset }
}
