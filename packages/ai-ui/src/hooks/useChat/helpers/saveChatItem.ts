import { ChatSenderRes } from '@/hooks/conversationSetup/types'
import { AxiosInstance } from 'axios'
import { requestToChatWithAxios } from 'gel-api'

/**
 * Save chat message to backend
 */

export const saveChatItem = ({
  axiosChat,
  result,
  questionStatus, // 0: 失败 1: 成功 -1: 取消
  isFirstQuestion = false,
  onRefresh,
}: {
  axiosChat: AxiosInstance
  result: ChatSenderRes
  questionStatus?: string
  isFirstQuestion?: boolean
  onRefresh?: () => void
}) => {
  return requestToChatWithAxios(axiosChat, 'chat/addChatItem', {
    chatId: result.chatId,
    rawSentence: result.rawSentence || result.searchword,
    rawSentenceID: result?.rawSentenceID,
    agentId: result?.agentId,
    questionStatus: questionStatus,
    renameFlag: isFirstQuestion,
  }).finally(() => {
    onRefresh?.()
  })
}
