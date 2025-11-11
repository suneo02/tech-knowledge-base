import React, { useEffect, useRef } from 'react'
import { ScrollContext } from './ScrollContext'
import { FloatButton } from 'antd'
import './index.less'

/**
 * LayoutScrollContent 组件
 * 提供统一的滚动容器，支持回到顶部功能和滚动位置记录
 * 支持页面级别和tab级别的滚动位置记录
 *
 * @component
 * @param {React.ReactNode} children - 子组件内容
 * @param {string} [title] - 页面标题
 * @param {boolean} [showBackTop] - 是否显示回到顶部按钮
 * @param {boolean} [center] - 是否居中内容
 * @param {number} [maxWidth] - 居中时的最大宽度，默认1360px
 */

interface LayoutScrollContentProps {
  children: React.ReactNode
  title?: string
  showBackTop?: boolean
  center?: boolean
  maxWidth?: number
}

const LayoutScrollContent: React.FC<LayoutScrollContentProps> = ({
  children,
  title,
  showBackTop,
  center = true,
  maxWidth = 1360,
}) => {
  const layoutScrollContentRef = useRef<HTMLDivElement>(null)
  const scrollPositionMap = useRef(new Map<string, number>())

  const getPositionKey = (tabId?: string | number) => {
    const path = window.location.pathname
    return tabId ? `${path}:${tabId}` : path
  }

  const scrollToTop = (behavior?: ScrollIntoViewOptions) => {
    layoutScrollContentRef?.current?.scrollTo({ top: 0, ...behavior })
  }

  const saveScrollPosition = (tabId?: string | number) => {
    console.log('saveScrollPosition pre', scrollPositionMap.current)
    if (layoutScrollContentRef.current) {
      const key = getPositionKey(tabId)
      scrollPositionMap.current.set(key, layoutScrollContentRef.current.scrollTop)
      console.log('saveScrollPosition after', scrollPositionMap.current)
    }
  }

  const restoreScrollPosition = (tabId?: string | number) => {
    if (layoutScrollContentRef.current) {
      const key = getPositionKey(tabId)
      const savedPosition = scrollPositionMap.current.get(key)
      if (savedPosition !== undefined) {
        // 目的是为了异步，防止页面还未渲染就执行，导致位置信息错误
        setTimeout(() => layoutScrollContentRef?.current?.scrollTo({ top: savedPosition }), 0)
      }
    }
  }

  // 页面级别的位置记录
  useEffect(() => {
    const currentPath = window.location.pathname
    const savedPosition = scrollPositionMap.current.get(currentPath)

    if (savedPosition !== undefined && layoutScrollContentRef.current) {
      layoutScrollContentRef.current.scrollTop = savedPosition
    }

    return () => {
      if (layoutScrollContentRef.current) {
        scrollPositionMap.current.set(currentPath, layoutScrollContentRef.current.scrollTop)
      }
    }
  }, [])

  return (
    <ScrollContext.Provider value={{ scrollToTop, saveScrollPosition, restoreScrollPosition }}>
      <div className="layout-scroll-content" ref={layoutScrollContentRef}>
        <div
          className="content"
          style={
            center
              ? {
                  maxWidth: `${maxWidth}px`,
                  margin: '0 auto',
                  width: '100%',
                }
              : undefined
          }
        >
          {children}
        </div>
        {showBackTop && <FloatButton.BackTop target={() => layoutScrollContentRef.current}></FloatButton.BackTop>}
      </div>
    </ScrollContext.Provider>
  )
}

export default LayoutScrollContent
