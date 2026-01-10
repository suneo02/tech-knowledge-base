import { useRef } from 'react'

export interface IndicatorTreePanelInnerRef {
  setSelectedIndicators: (indicators: Set<number>) => void
  reset: () => void
  getCheckedIndicators: () => Set<number>
}

export interface IndicatorTreePanelInnerInstance extends IndicatorTreePanelInnerRef {
  getTreeRef: () => React.RefObject<IndicatorTreePanelInnerRef>
}

export const useIndicatorTreePanelScroll = () => {
  const ref = useRef<IndicatorTreePanelInnerRef>(null)
  // 用于开发环境下的警告提示
  const warning = useRef(false)

  const warnIfNotReady = () => {
    if (process.env.NODE_ENV !== 'production' && !warning.current) {
      warning.current = true
      console.warn('IndicatorTreeOverall is not ready. ' + 'Please ensure it is rendered with valid props.')
    }
  }
  // @ts-expect-error ttt
  const instance: IndicatorTreePanelInnerInstance = {
    getTreeRef: () => ref,
    reset: () => {
      if (!ref.current) {
        warnIfNotReady()
        return
      }
      ref.current.reset()
    },
    setSelectedIndicators: (indicators) => {
      if (!ref.current) {
        warnIfNotReady()
        return
      }
      ref.current.setSelectedIndicators(indicators)
    },
  }
  return instance
}
