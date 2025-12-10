/**
 * 取消聊天请求的静态函数
 * @param params 取消请求所需的参数
 */

import { ChatSenderRes, cancelChatRequest } from '@/service'
import { AxiosInstance } from 'axios'
import { useCallback } from 'react'

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
