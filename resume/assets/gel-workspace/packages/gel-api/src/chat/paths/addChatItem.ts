import { AgentId } from '../types'

// 问答结果上报请求参数
export type AddChatItemRequest = {
  chatId: string
  rawSentenceID: string
  rawSentence: string
  // text: string 删除 由后端记录
  // think?: string // 深度思考的结果 删除 由后端记录
  questionGuide?: string
  questionStatus?: string
  renameFlag?: boolean // 是否是第一次问句重命名标识
  agentId?: AgentId
}

/**
 * Chat API response types
 */

export interface ChatQuestion {
  /** Whether the question is dynamic */
  isDynamic: boolean
  /** Question type: 0 for data search, 1 for graph/chart */
  questionsType: number
  /** The question text */
  questions: string
  /** SVG icon for the question type */
  questionsIcon: string
}
