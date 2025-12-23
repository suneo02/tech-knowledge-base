import { useEffect, useRef } from 'react'

/**
 * 自定义 Hook 用于监听元素是否进入视口
 * @param callback 回调函数，在元素进入视口时触发
 * @param threshold 触发阈值
 */
export function useOnViewportEnter(callback: () => void, threshold: number = 0) {
  const elementRef = useRef<HTMLDivElement | null>(null)
  const observerRef = useRef<IntersectionObserver | null>(null)

  useEffect(() => {
    if (elementRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              callback()
              observerRef.current?.disconnect() // 断开连接
            }
          })
        },
        { threshold }
      )

      observerRef.current.observe(elementRef.current)

      return () => {
        observerRef.current?.disconnect()
      }
    }
  }, [callback, threshold])

  return elementRef
}
