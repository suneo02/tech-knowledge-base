/**
 * 简化的取消请求 Hook
 * 专注于新架构的 RuntimeState 和 input 参数
 */

import type { RuntimeState } from '@/service/agentRequest/types'
import type { ChatSendInput } from '@/types/ai-chat-perf'
import { AxiosInstance } from 'axios'
import { ChatQuestionStatus, requestToChatWithAxios } from 'gel-api'
import { useCallback } from 'react'

interface CancelRequestParams<TInput extends ChatSendInput = ChatSendInput> {
  /** 设置聊天状态的函数 */
  setIsChating: (value: boolean) => void
  /** 普通请求的 AbortController ref */
  abortControllerRef: React.MutableRefObject<AbortController | null>
  /** 流式请求的 AbortController ref */
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>
  /** 运行时状态 ref */
  runtimeStateRef: React.MutableRefObject<RuntimeState | null>
  /** 输入数据 ref */
  inputRef: React.MutableRefObject<TInput | null>
  /** axios 实例 */
  axiosInstance: AxiosInstance
  /** 刷新回调 */
  onRefresh?: () => void
}

/**
 * 简化的取消请求 Hook
 *
 * @example
 * const cancel = useCancelChatReq({
 *   setIsChating,
 *   abortControllerRef,
 *   abortStreamControllerRef,
 *   runtimeStateRef,
 *   inputRef,
 *   axiosInstance,
 *   onRefresh,
 * })
 */
export const useCancelChatReq = <TInput extends ChatSendInput = ChatSendInput>(params: CancelRequestParams<TInput>) => {
  const {
    setIsChating,
    abortControllerRef,
    abortStreamControllerRef,
    runtimeStateRef,
    inputRef,
    axiosInstance,
    onRefresh,
  } = params

  return useCallback(async () => {
    console.log('🚫 开始取消请求')

    // 1. 立即设置聊天状态
    setIsChating(false)

    // 2. 取消 AbortController
    abortControllerRef.current?.abort('用户取消')
    abortStreamControllerRef.current?.abort('用户取消')

    // 3. 上报取消状态
    const runtime = runtimeStateRef.current
    const input = inputRef.current

    if (runtime?.chatId && input) {
      try {
        await requestToChatWithAxios(axiosInstance, 'chat/addChatItem', {
          chatId: runtime.chatId,
          rawSentence: input.content,
          rawSentenceID: runtime.rawSentenceID || '',
          agentId: input.agentId,
          questionStatus: ChatQuestionStatus.CANCELLED,
          renameFlag: !Boolean(input.chatId),
        })
        console.log('📊 取消请求上报完成')
      } catch (error) {
        console.error('❌ 取消请求上报失败:', error)
      }
    } else {
      console.log('⚠️ 没有完整的状态数据，跳过上报')
    }

    // 4. 刷新
    onRefresh?.()
    console.log('✅ 取消请求完成')
  }, [setIsChating, abortControllerRef, abortStreamControllerRef, runtimeStateRef, inputRef, axiosInstance, onRefresh])
}
