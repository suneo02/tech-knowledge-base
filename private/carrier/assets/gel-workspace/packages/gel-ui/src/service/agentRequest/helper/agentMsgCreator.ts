import { AgentMsgAIDepre, AgentMsgAIShare, ChatSendInput } from '@/types'
import { ChatRunContext } from '../runContext'

export const createAgentMsgAIInitBySendInput = (message: ChatSendInput): AgentMsgAIShare => ({
  role: 'ai',
  rawSentence: message.content,
  think: message.think,
  content: '',
  reasonContent: '',
})

export const createAgentMsgAISubQuestion = (message: ChatSendInput, subQuestion: string[]): AgentMsgAIShare => ({
  ...createAgentMsgAIInitBySendInput(message),
  subQuestion,
})

/**
 * AI 消息在 数据召回 后
 */
export const createAgentMsgAIDataRetrieval = (message: ChatSendInput, runContext: ChatRunContext): AgentMsgAIDepre => {
  const { runtime } = runContext
  return {
    ...createAgentMsgAIInitBySendInput(message),
    entity: runtime.entity,
    rawSentenceID: runtime.rawSentenceID,
    ragList: runtime.ragResponse?.items,
    dpuList: runtime.dpuResponse?.data,
    chartType: runtime.dpuResponse?.chart,
    splTable: runtime.splTable,
  }
}

/** ai 消息在流式输出中 */
export const createAgentAIMsgStream = (
  message: ChatSendInput,
  runContext: ChatRunContext,
  content: string,
  reasonContent: string
): AgentMsgAIDepre => ({
  ...createAgentMsgAIDataRetrieval(message, runContext),
  content,
  reasonContent,
})
