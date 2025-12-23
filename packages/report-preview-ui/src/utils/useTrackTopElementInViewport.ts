import { debounce } from 'lodash'
import { useCallback, useEffect } from 'react'

export function useTrackTopElementInViewport(
  containerRef: React.RefObject<HTMLElement>,
  itemRefs: { [id: string]: HTMLElement | null },
  currentTopItemId: string | null,
  onTopItemChanged: (itemId: string | null) => void,
  debounceMs: number = 100
) {
  const handleScroll = useCallback(
    debounce(() => {
      const container = containerRef.current
      if (!container || Object.keys(itemRefs).length === 0) {
        if (currentTopItemId !== null) {
          onTopItemChanged(null)
        }
        return
      }
      const containerHeight = container.clientHeight || 0
      let newTopItemId: string | null = null
      let smallestPositiveOffset = Infinity
      let largestNegativeOffsetTop = -Infinity
      for (const id in itemRefs) {
        const el = itemRefs[id]
        if (!el || el.offsetParent === null) continue // skip hidden or null
        const elementTop = el.offsetTop - container.scrollTop
        const elementHeight = el.offsetHeight || 0
        const elementBottom = elementTop + elementHeight
        const isPartiallyVisible = elementBottom > 0 && elementTop < containerHeight
        if (isPartiallyVisible) {
          if (elementTop <= 0) {
            if (elementTop > largestNegativeOffsetTop) {
              largestNegativeOffsetTop = elementTop
              newTopItemId = id
            }
          } else {
            if (newTopItemId === null || largestNegativeOffsetTop === -Infinity) {
              if (elementTop < smallestPositiveOffset) {
                smallestPositiveOffset = elementTop
                newTopItemId = id
              }
            }
          }
        }
      }
      if (largestNegativeOffsetTop > -Infinity) {
        // already set
      } else if (smallestPositiveOffset !== Infinity) {
        // already set
      } else {
        newTopItemId = null
      }
      if (currentTopItemId !== newTopItemId) {
        onTopItemChanged(newTopItemId)
      }
    }, debounceMs),
    [containerRef, itemRefs, currentTopItemId, onTopItemChanged, debounceMs]
  )
  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    container.addEventListener('scroll', handleScroll)
    // Initial check
    handleScroll()
    return () => {
      container.removeEventListener('scroll', handleScroll)
    }
  }, [containerRef, handleScroll])
}
