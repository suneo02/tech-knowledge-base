import { useCallback, useEffect, useRef, useState } from 'react'

interface UseScrollToBottomProps<T extends any> {
  parsedMessages: T
  isChating: boolean
}

/**
 * 聊天消息滚动控制 Hook
 *
 * 负责处理：
 * 1. 滚动位置跟踪
 * 2. "滚动到底部"按钮的显示逻辑
 * 3. 自动滚动行为
 *
 * @param parsedMessages 解析后的消息列表
 * @param isChating 是否正在聊天（流式响应中）
 * @returns 滚动相关的状态和方法
 */
export const useScrollToBottom = <T extends any>({ parsedMessages, isChating }: UseScrollToBottomProps<T>) => {
  // 控制是否显示"滚动到底部"按钮
  const [showScrollBottom, setShowScrollBottom] = useState(false)
  // 用于跟踪用户是否在底部
  const [isAtBottom, setIsAtBottom] = useState(true)
  // 用于跟踪消息流式输出时用户的位置状态
  const [wasAtBottomWhenStreamingStarted, setWasAtBottomWhenStreamingStarted] = useState(true)
  // 聊天容器的引用，用于滚动控制
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // 当流式输出开始时记录用户是否在底部
  useEffect(() => {
    if (isChating) {
      setWasAtBottomWhenStreamingStarted(isAtBottom)
    }
  }, [isChating, isAtBottom])

  // 处理滚动事件，控制"滚动到底部"按钮的显示和用户是否在底部的状态
  const handleScroll = useCallback(() => {
    if (!chatContainerRef.current) return
    const { scrollTop, scrollHeight, clientHeight } = chatContainerRef.current
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight

    // 当距离底部超过 200px 时显示按钮
    setShowScrollBottom(distanceFromBottom > 200)

    // 判断用户是否在底部（允许小误差范围，例如 10px）
    setIsAtBottom(distanceFromBottom < 80)
  }, [])

  // 滚动到底部的方法
  const scrollToBottom = useCallback(() => {
    if (!chatContainerRef.current) return
    chatContainerRef.current.scrollTo({
      top: chatContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [])

  // 添加滚动事件监听
  useEffect(() => {
    const container = chatContainerRef.current
    if (container) {
      container.addEventListener('scroll', handleScroll)
      return () => container.removeEventListener('scroll', handleScroll)
    }
  }, [handleScroll])

  // 仅在以下情况自动滚动到底部：
  // 1. 新消息到达且用户当前在底部
  // 2. 流式响应中，且用户在流式响应开始时在底部
  useEffect(() => {
    const shouldAutoScroll = !isChating || (isChating && wasAtBottomWhenStreamingStarted)
    if (shouldAutoScroll && isAtBottom) {
      scrollToBottom()
    }
  }, [parsedMessages, isAtBottom, isChating, wasAtBottomWhenStreamingStarted, scrollToBottom])

  return {
    chatContainerRef,
    showScrollBottom,
    scrollToBottom,
  }
}
