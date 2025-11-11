import { AxiosInstance } from 'axios'
import { ChatQuestionStatus } from 'gel-api'
import { ChatSenderRes, saveChatItem } from './saveChatItem'

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
        questionStatus: ChatQuestionStatus.CANCELLED,
        isFirstQuestion: isFirstQuestionRef.current,
      }).finally(() => {
        onRefresh?.()
      })
    }
    return
  }

  if (abortStreamController) {
    abortStreamController?.abort()
  }
}
