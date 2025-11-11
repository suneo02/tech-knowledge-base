import {
  AgentIdentifiers,
  ChatClientTypeIdentifier,
  ChatRawSentenceIdentifier,
  ChatRawSentenceIdIdentifier,
  DeepSearchSignal,
} from '../types'

// 问句拆解请求参数
export interface GetUserQuestionRequest
  extends Pick<AgentIdentifiers, 'agentId'>,
    DeepSearchSignal,
    ChatClientTypeIdentifier,
    ChatRawSentenceIdentifier,
    ChatRawSentenceIdIdentifier {
  version?: number
}
