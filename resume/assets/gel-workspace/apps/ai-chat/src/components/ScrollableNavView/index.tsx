import React, { useState, useEffect, useRef, useCallback } from 'react'
// import { Row, Col } from '@wind/wind-ui' // Removed Row and Col
import styles from './index.module.less'

const PREFIX = 'scrollable-nav-view'
const DEBOUNCE_DELAY = 50
const SCROLL_TO_BOTTOM_THRESHOLD = 5

export interface ScrollableNavItem<T extends { id: string }> {
  id: string
  navTitle: string
  icon?: string
  data: T // Original data item, can be used by the parent to construct content or handle actions
  content: React.ReactNode // Content to render in the right panel for this item
}

export interface ScrollableNavViewProps<T extends { id: string }> {
  items: ScrollableNavItem<T>[]
  headerContent?: React.ReactNode // Optional header content (e.g., title, back button)
  defaultActiveId?: string
  navWidth?: number | string // New prop for left navigation width
  // Potentially add props for styling overrides or class names if needed for more flexibility
}

export const ScrollableNavView = <T extends { id: string }>({
  items,
  defaultActiveId,
  navWidth = '160px', // Default navWidth
}: ScrollableNavViewProps<T>) => {
  const [activeItemId, setActiveItemId] = useState<string | null>(() => {
    if (defaultActiveId && items.find((item) => item.id === defaultActiveId)) {
      return defaultActiveId
    }
    return items.length > 0 ? items[0].id : null
  })

  const contentScrollRef = useRef<HTMLDivElement>(null)
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({})
  const debounceTimerRef = useRef<number | null>(null)

  const scrollToSection = useCallback((itemId: string) => {
    const sectionElement = sectionRefs.current[itemId]
    const scrollContainer = contentScrollRef.current
    if (sectionElement && scrollContainer) {
      const containerRect = scrollContainer.getBoundingClientRect()
      const sectionRect = sectionElement.getBoundingClientRect()
      const targetScrollTop = scrollContainer.scrollTop + (sectionRect.top - containerRect.top)
      scrollContainer.scrollTo({
        top: targetScrollTop,
        behavior: 'smooth',
      })
    }
  }, [])

  const handleLeftNavClick = (itemId: string) => {
    setActiveItemId(itemId)
    scrollToSection(itemId)
  }

  const handleScroll = useCallback(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }
    debounceTimerRef.current = setTimeout(() => {
      const scrollContainer = contentScrollRef.current
      if (!scrollContainer || items.length === 0) return

      const containerViewTop = scrollContainer.getBoundingClientRect().top
      const containerHeight = scrollContainer.clientHeight
      const scrollTop = scrollContainer.scrollTop
      const scrollHeight = scrollContainer.scrollHeight

      let newActiveId: string | null = activeItemId // Default to current to avoid flickering if nothing found

      const isAtBottom = scrollHeight - scrollTop - containerHeight < SCROLL_TO_BOTTOM_THRESHOLD

      if (isAtBottom) {
        for (let i = items.length - 1; i >= 0; i--) {
          const item = items[i]
          const sectionEl = sectionRefs.current[item.id]
          if (sectionEl) {
            const sectionRect = sectionEl.getBoundingClientRect()
            if (sectionRect.bottom > containerViewTop && sectionRect.top < containerViewTop + containerHeight) {
              newActiveId = item.id
              break
            }
          }
        }
      } else {
        let minDistanceToViewportTop = Infinity
        let foundActiveCandidate = false

        for (const item of items) {
          const sectionEl = sectionRefs.current[item.id]
          if (sectionEl) {
            const sectionRect = sectionEl.getBoundingClientRect()
            const sectionTopRelativeToContainer = sectionRect.top - containerViewTop
            const isPartiallyVisible =
              sectionRect.bottom > containerViewTop && sectionRect.top < containerViewTop + containerHeight

            if (isPartiallyVisible) {
              if (
                sectionTopRelativeToContainer > -sectionEl.offsetHeight * 0.75 &&
                sectionTopRelativeToContainer < containerHeight * 0.6
              ) {
                if (Math.abs(sectionTopRelativeToContainer) < minDistanceToViewportTop) {
                  minDistanceToViewportTop = Math.abs(sectionTopRelativeToContainer)
                  newActiveId = item.id
                  foundActiveCandidate = true
                }
              }
            }
          }
        }
        if (!foundActiveCandidate && items.length > 0 && scrollTop <= 0) {
          newActiveId = items[0].id // Default to first if at top and no other found
        }
      }

      if (newActiveId && newActiveId !== activeItemId) {
        setActiveItemId(newActiveId)
      }
    }, DEBOUNCE_DELAY)
  }, [activeItemId, items]) // Removed scrollToSection from dependencies

  useEffect(() => {
    const scrollContainer = contentScrollRef.current
    if (scrollContainer) {
      handleScroll() // Initial check
      scrollContainer.addEventListener('scroll', handleScroll)
    }
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener('scroll', handleScroll)
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [handleScroll])

  // Initial scroll to defaultActiveId if provided and valid
  useEffect(() => {
    if (defaultActiveId && items.find((item) => item.id === defaultActiveId)) {
      // A slight delay can help ensure the layout is stable before scrolling
      const timer = setTimeout(() => {
        // Check if scrollToSection is defined before calling
        if (typeof scrollToSection === 'function') {
          scrollToSection(defaultActiveId)
        }
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [defaultActiveId, items, scrollToSection]) // Add items and scrollToSection

  if (!items || items.length === 0) {
    // Optional: Render a specific message or allow parent to handle empty state
    return null
  }

  return (
    <div className={styles[`${PREFIX}-body`]}>
      {/* New body container */}
      {/* <div
        className={styles[`${PREFIX}-nav-panel`]}
        style={{ flex: typeof navWidth === 'number' ? `0 0 ${navWidth}px` : `0 0 ${navWidth}` }}
      >
        <ul className={styles[`${PREFIX}-nav`]}>
          {items.map((item) => (
            <li
              key={item.id}
              className={
                activeItemId === item.id
                  ? `${styles[`${PREFIX}-nav-item-active`]} ${styles[`${PREFIX}-nav-item`]}`
                  : styles[`${PREFIX}-nav-item`]
              }
              onClick={() => handleLeftNavClick(item.id)}
            >
              {item.icon && <img src={`src/assets/icon/super/menu/${item.icon}.svg`} alt={item.navTitle} />}
              {item.navTitle}
            </li>
          ))}
        </ul>
      </div> */}

      <div ref={contentScrollRef} className={styles[`${PREFIX}-content-scroll-area`]}>
        {items.map((item) => (
          <section
            id={`item-section-${item.id}`} // Ensure unique ID for sections
            key={item.id}
            ref={(el) => (sectionRefs.current[item.id] = el)}
            className={styles[`${PREFIX}-content-section`]}
          >
            {item.content}
            {/* Optional: Render an action button if onItemAction is provided */}
            {/* This part is very basic, item.content should ideally be structured to allow placing a button */}
            {/* For more complex content, the parent should structure item.content with a card and button if needed */}
          </section>
        ))}
      </div>
    </div>
  )
}
