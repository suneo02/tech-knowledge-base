import { AgentIdentifiers, ChatRawSentenceIdentifier, ChatRawSentenceIdIdentifier } from '../types'

// 推荐问句请求参数
export type UserQuestionGuideRequest = ChatRawSentenceIdentifier &
  ChatRawSentenceIdIdentifier & {
    version?: number
  } & Pick<AgentIdentifiers, 'agentId'>

// 推荐问句响应
export interface UserQuestionGuideResponse {
  result: string
}
