import { useEffect, useRef, useState } from 'react'

// 自定义 Hook 检测 companyTab 宽度
export const useCompanyTabWidth = () => {
  const [isWidthLessThan985, setIsWidthLessThan985] = useState(false)
  const observerRef = useRef<ResizeObserver | null>(null)

  useEffect(() => {
    const checkWidth = () => {
      const companyTabElement = document.querySelector('.companyTab') as HTMLElement
      if (companyTabElement) {
        const width = companyTabElement.offsetWidth
        setIsWidthLessThan985(width < 985)
      }
    }

    // 初始检查
    checkWidth()

    // 创建 ResizeObserver 监听宽度变化
    if (window.ResizeObserver) {
      observerRef.current = new ResizeObserver(() => {
        checkWidth()
      })

      const companyTabElement = document.querySelector('.companyTab')
      if (companyTabElement) {
        observerRef.current.observe(companyTabElement)
      }
    } else {
      // 降级方案：使用 window resize 事件
      window.addEventListener('resize', checkWidth)
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect()
      } else {
        window.removeEventListener('resize', checkWidth)
      }
    }
  }, [])

  return isWidthLessThan985
}
