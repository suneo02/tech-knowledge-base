import { AgentIdentifiers } from '../types'

// 推荐问句请求参数
export type UserQuestionGuideRequest = {
  rawSentence: string
  rawSentenceID: string
  version?: number
} & Pick<AgentIdentifiers, 'agentId'>

// 推荐问句响应
export interface UserQuestionGuideResponse {
  result: string
}
