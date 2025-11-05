import { GelData, QueryReferenceSuggest, RefTableData, SessionCompleteResponse } from 'gel-api'
import { ReactNode } from 'react'
import { BaseMessageFields } from './common'
import { MessageRawCore } from './raw'

export type AIMsgBaseContent = {
  answer: string
  entities?: SessionCompleteResponse[]
  reasonContent?: string
  error?: string
  refTable?: RefTableData[]
  refBase?: QueryReferenceSuggest[]
}
/** AI消息状态 */
export type AIMessageStatus = 'pending' | 'receiving' | 'stream_finish' | 'finish'
/** 其他消息状态（除了user和ai） */
type OtherMessageStatus = 'pending' | 'finish'
/** 用户消息 */
export type UserMessageGEL = BaseMessageFields & {
  role: 'user'
  content: string
}
/** AI消息 */
export type AIMessageGEL = BaseMessageFields & {
  role: 'ai'
  content: AIMsgBaseContent | string
  status: AIMessageStatus
}
export type AIHeaderMsg = BaseMessageFields & {
  role: 'aiHeader'
  status: OtherMessageStatus
  content: ReactNode
  styles?: {
    content?: React.CSSProperties
  }
}
/** 建议消息 */
export type SuggestionMessage = BaseMessageFields & {
  role: 'suggestion'
  content: {
    reference: QueryReferenceSuggest[]
    table: RefTableData[]
  }
  status: OtherMessageStatus
}

/** 文件消息 */
export type FileMessage = BaseMessageFields & {
  role: 'file'
  content: string
  status: OtherMessageStatus
}

/** 子问题消息 */
export type SubQuestionMessage = {
  role: 'subQuestion'
  content: string[]
  status: OtherMessageStatus
}
/** 图表消息 */
export type ChartMessage = BaseMessageFields & {
  role: 'chart'
  content: GelData[]
  status: OtherMessageStatus
}
/** 简单图表消息 */
export type SimpleChartMessage = BaseMessageFields & {
  role: 'simpleChart'
  content: MessageRawCore[]
  status: OtherMessageStatus
}
/** 问答引导消息 */
export type QuestionGuideMessage = BaseMessageFields & {
  role: 'questionGuide'
  content: string[]
  status: OtherMessageStatus
}

/** 智能表格消息 */
export type SmartTableMessage = BaseMessageFields & {
  role: 'smartTable'
  content: string[]
  status: OtherMessageStatus
}

/**
 * 基础聊天消息类型 这个类型是已解析处理过的 后端消息
 */
export type MessageParsedCore =
  | UserMessageGEL
  | AIMessageGEL
  | AIHeaderMsg
  | SuggestionMessage
  | FileMessage
  | ChartMessage
  | SubQuestionMessage
  | SimpleChartMessage
