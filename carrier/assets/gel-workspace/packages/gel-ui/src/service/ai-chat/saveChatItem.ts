import { AxiosInstance } from 'axios'
import {
  AgentIdentifiers,
  ChatDPUResponse,
  ChatQuestionIdentifier,
  ChatQuestionStatus,
  ChatRAGResponse,
  ChatRawSentenceIdentifier,
  ChatRawSentenceIdIdentifier,
  ChatTypeEnum,
  EModelType,
  GelData,
  ReportChatData,
  requestToChatWithAxios,
  SplTable,
  WithDPUList,
} from 'gel-api'

/**
 * @deprecated
 */
export type ChatSenderRes = {
  chatId: string
  gelData: GelData[] | undefined
  chartType: ChatTypeEnum | undefined
  modelType?: EModelType // 回答使用模型
  suggest?: ChatRAGResponse
  content?: ChatDPUResponse
  reportData?: ReportChatData
  splTable?: SplTable[]
} & AgentIdentifiers &
  ChatRawSentenceIdIdentifier &
  Partial<ChatRawSentenceIdentifier> &
  Partial<WithDPUList> &
  Partial<ChatQuestionIdentifier>

/**
 * Save chat message to backend
 */

export const saveChatItem = ({
  axiosChat,
  result,
  questionStatus, // 问答状态枚举
  isFirstQuestion = false,
}: {
  axiosChat: AxiosInstance
  result: ChatSenderRes
  questionStatus?: ChatQuestionStatus
  isFirstQuestion?: boolean
}) => {
  return requestToChatWithAxios(axiosChat, 'chat/addChatItem', {
    chatId: result.chatId,
    rawSentence: result.rawSentence || result.searchword || '',
    rawSentenceID: result?.rawSentenceID,
    agentId: result?.agentId,
    questionStatus: questionStatus,
    renameFlag: isFirstQuestion,
  })
}
