import { AgentMsgAIOverall, AgentMsgUserOverall } from '@/types'
import { ChatEntityRecognize } from 'gel-api'
import { ChatSenderRes } from '../saveChatItem'

/**
 * ai 消息在任意接口之前
 */
export const createAIResponseInit = (message: AgentMsgUserOverall): AgentMsgAIOverall => ({
  role: 'ai',
  rawSentence: message.content,
  think: message.think,
  content: '',
  reasonContent: '',
  entity: [],
})

/**ai 消息在 字句拆解中 */
export const createAIResponseSubQuestion = (
  message: AgentMsgUserOverall,
  subQuestion: string[]
): AgentMsgAIOverall => ({
  ...createAIResponseInit(message),
  subQuestion,
})

/**ai 消息在 数据召回后 */
export const createAIResponseDataRetrieval = (
  message: AgentMsgUserOverall,
  subQuestion: string[],
  entities: ChatEntityRecognize[],
  result: ChatSenderRes | undefined
): AgentMsgAIOverall => {
  console.log('🚀 ~createAIResponseDataRetrieval result:', result)
  return {
    ...createAIResponseInit(message),
    entity: entities,
    rawSentenceID: result?.rawSentenceID,
    ragList: result?.suggest?.items,
    dpuList: result?.dpuList,
    chartType: result?.chartType,
    splTable: result?.splTable,
    subQuestion,
  }
}

/** ai 消息在流式输出中 */
export const createAIResponseStream = (
  message: AgentMsgUserOverall,
  content: string,
  reasonContent: string,
  entities: ChatEntityRecognize[],
  result: ChatSenderRes
): AgentMsgAIOverall => ({
  ...createAIResponseDataRetrieval(message, [], entities, result),
  content,
  reasonContent,
})
