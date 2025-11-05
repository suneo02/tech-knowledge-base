/**
 * 取消聊天请求的静态函数
 * @param params 取消请求所需的参数
 */

import { ChatSenderRes } from '@/hooks/conversationSetup/types'
import { AxiosInstance } from 'axios'
import { useCallback } from 'react'
import { saveChatItem } from './saveChatItem'

export const cancelChatRequest = ({
  abortStreamController,
  abortController,
  setIsChating,
  latestResult,
  isFirstQuestionRef,
  onRefresh,
  axiosChat,
}: {
  abortStreamController: AbortController | null
  abortController: AbortController | null
  setIsChating: (value: boolean) => void
  latestResult: ChatSenderRes | undefined
  isFirstQuestionRef: React.MutableRefObject<boolean>
  onRefresh?: () => void
  axiosChat: AxiosInstance
}) => {
  console.log('🚀 ~ cancelRequest ~ abortController:', abortController, 'abortStreamController', abortStreamController)

  if (!abortStreamController && !abortController) {
    return
  }

  setIsChating(false)

  // 非流失接口取消时上报
  if (abortController) {
    abortController?.abort()
    // 取消请求时也调用saveChatItem进行上报
    if (latestResult) {
      saveChatItem({
        axiosChat,
        result: latestResult,
        questionStatus: '-1',
        isFirstQuestion: isFirstQuestionRef.current,
        onRefresh,
      })
    }
    return
  }

  if (abortStreamController) {
    abortStreamController?.abort()
  }
}

export const useCancelChatRequest = (
  axiosChat: AxiosInstance,
  setIsChating: (value: boolean) => void,
  latestResultRef: React.RefObject<ChatSenderRes | undefined>,
  abortStreamControllerRef: React.MutableRefObject<AbortController | null>,
  abortControllerRef: React.MutableRefObject<AbortController | null>,
  isFirstQuestionRef: React.MutableRefObject<boolean>,
  onRefresh?: () => void
) => {
  /**
   * 取消任何正在进行的聊天请求
   * 这会中止当前请求并更新聊天状态
   */
  return useCallback(() => {
    cancelChatRequest({
      abortStreamController: abortStreamControllerRef.current,
      abortController: abortControllerRef.current,
      setIsChating,
      latestResult: latestResultRef.current || undefined,
      isFirstQuestionRef,
      onRefresh,
      axiosChat,
    })
  }, [setIsChating])
}
