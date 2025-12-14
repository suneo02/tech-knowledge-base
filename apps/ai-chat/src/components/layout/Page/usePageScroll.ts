import { useState, useEffect, RefObject } from 'react'

interface UsePageScrollProps {
  contentRef: RefObject<HTMLDivElement>
  scrollable: boolean
  fixedHeader: boolean
}

export const usePageScroll = ({ contentRef, scrollable, fixedHeader }: UsePageScrollProps) => {
  const [showBackToTop, setShowBackToTop] = useState(false)
  const [showHeaderShadow, setShowHeaderShadow] = useState(false)

  const handleScroll = () => {
    if (contentRef.current) {
      const { scrollTop } = contentRef.current
      // 当滚动超过 200px 时显示按钮
      setShowBackToTop(scrollTop > 200)

      // 固定头部阴影逻辑
      if (fixedHeader) {
        setShowHeaderShadow(scrollTop > 10)
      } else {
        // 如果 header 不是固定的，则移除阴影
        setShowHeaderShadow(false)
      }
    }
  }

  const scrollToTop = () => {
    contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // 监听滚动事件仅在 scrollable 为 true 时生效
  useEffect(() => {
    const contentElement = contentRef.current
    if (scrollable && contentElement) {
      // 初始状态检查
      handleScroll()
      contentElement.addEventListener('scroll', handleScroll)
      // 清理函数
      return () => {
        contentElement.removeEventListener('scroll', handleScroll)
      }
    }
    // 如果不可滚动，则重置状态
    else {
      setShowBackToTop(false)
      setShowHeaderShadow(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollable, fixedHeader, contentRef]) // 添加 contentRef 到依赖项

  return { showBackToTop, showHeaderShadow, scrollToTop }
}
