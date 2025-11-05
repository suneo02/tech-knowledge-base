import { createContext, useContext } from 'react'

interface ScrollContextType {
  scrollToTop: (behavior?: ScrollIntoViewOptions) => void
  saveScrollPosition: (tabId?: string | number) => void
  restoreScrollPosition: (tabId?: string | number) => void
}

export const ScrollContext = createContext<ScrollContextType | undefined>(undefined)

export const useScrollContext = () => {
  const context = useContext(ScrollContext)
  if (context === undefined) {
    throw new Error('useScrollContext must be used within a ScrollProvider')
  }
  return context
}
