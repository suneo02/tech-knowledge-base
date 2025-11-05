import { useEffect, useRef } from 'react'

interface UseChatSessionControlParams {
  chatId: string | null | undefined
  // 通常由上层组件从 getConversationDetail 接口获取的结果
  shouldRestore: boolean
  // 请求恢复会话的回调函数
  onRestore: () => void
  // 是否有初始消息，从父组件传入
  hasInitialMessage: boolean
}

/**
 * 聊天会话控制 Hook
 *
 * 协调会话恢复和初始消息逻辑，处理以下情况：
 * 1. URL 包含 initialMsg: 不恢复会话，使用初始消息
 * 2. URL 不包含 initialMsg 且 chatId 存在: 恢复会话
 *
 * @param params 控制参数
 */
export const useChatSessionControl = ({
  chatId,
  shouldRestore,
  onRestore,
  hasInitialMessage,
}: UseChatSessionControlParams): void => {
  const hasRestoredRef = useRef(false)

  useEffect(() => {
    // 如果满足以下条件，则恢复会话：
    // 1. 存在有效的 chatId
    // 2. shouldRestore 为 true (表示应该恢复)
    // 3. URL 中没有初始消息参数 (hasInitialMessage 为 false)
    // 4. 尚未恢复过会话 (防止重复恢复)
    if (chatId && shouldRestore && !hasInitialMessage && !hasRestoredRef.current) {
      onRestore()
      hasRestoredRef.current = true
    }
  }, [chatId, shouldRestore, hasInitialMessage, onRestore])
}
