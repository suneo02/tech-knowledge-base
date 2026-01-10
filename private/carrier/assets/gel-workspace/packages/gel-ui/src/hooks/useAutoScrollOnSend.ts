import { useCallback } from 'react'

/**
 * 发送消息后自动滚动配置选项
 */
export interface UseAutoScrollOnSendOptions<TSendFn extends (...args: any[]) => any> {
  /** 滚动到底部的函数 */
  scrollToBottom: () => void
  /** 发送消息函数 */
  sendMessage: TSendFn
}

/**
 * 发送消息后自动滚动 Hook
 *
 * 传入 sendMessage 函数，返回包装后自动滚动的版本
 *
 * @example
 * ```tsx
 * const sendMessageAndScroll = useAutoScrollOnSend({
 *   scrollToBottom,
 *   sendMessage
 * })
 *
 * // 使用包装后的函数
 * sendMessageAndScroll(message, agentId, deepthink)
 * ```
 */
export function useAutoScrollOnSend<TSendFn extends (...args: any[]) => any>({
  scrollToBottom,
  sendMessage,
}: UseAutoScrollOnSendOptions<TSendFn>): TSendFn {
  /**
   * 包装后的发送消息函数，发送后自动滚动到底部
   */
  const sendMessageAndScroll = useCallback(
    (...args: Parameters<TSendFn>): ReturnType<TSendFn> => {
      const result = sendMessage(...args)
      // 发送消息后延迟滚动到底部，确保消息已添加到 DOM
      setTimeout(scrollToBottom, 50)
      return result
    },
    [sendMessage, scrollToBottom]
  ) as TSendFn

  return sendMessageAndScroll
}
