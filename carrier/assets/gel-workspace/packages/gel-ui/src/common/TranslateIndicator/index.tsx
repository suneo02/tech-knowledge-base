import { message } from '@wind/wind-ui'
import { useEffect, useRef } from 'react'

/**
 * 翻译进度指示器组件
 * @author 张文浩<suneo@wind.com.cn>
 * @param isTranslating - 是否正在翻译
 * @description 显示翻译进度的消息提示组件
 */
type Props = {
  isTranslating: boolean
}

export const TranslateIndicator = ({ isTranslating }: Props) => {
  const hideMessageRef = useRef<(() => void) | null>(null)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (isTranslating) {
      // 清除之前的定时器
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // 如果已有消息显示，延迟关闭以确保消息已创建
      if (hideMessageRef.current) {
        const prevHide = hideMessageRef.current
        setTimeout(() => {
          prevHide()
        }, 0)
        hideMessageRef.current = null
      }

      // 显示新的加载消息
      hideMessageRef.current = message.loading('Translate in progress', 0)
    } else {
      // 延迟关闭加载消息，确保消息已完全创建
      if (hideMessageRef.current) {
        const hideFunc = hideMessageRef.current
        timeoutRef.current = setTimeout(() => {
          hideFunc()
          hideMessageRef.current = null
          timeoutRef.current = null
        }, 16) // 给一个 requestAnimationFrame 的延迟确保消息已创建
      }
    }
  }, [isTranslating])

  // 组件卸载时清理消息和定时器
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      if (hideMessageRef.current) {
        // 延迟执行以确保消息已创建
        setTimeout(() => {
          if (hideMessageRef.current) {
            hideMessageRef.current()
          }
        }, 0)
      }
    }
  }, [])

  return null
}
