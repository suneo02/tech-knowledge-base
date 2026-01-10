import { ChatEntityRecognize, GelData, SplTable, WithDPUList, WithRAGList } from 'gel-api'
import { ReactNode } from 'react'
import { AgentMsgAIOverall } from './agent'
import { AIMessageStatus, OtherMessageStatus } from './common'

export type AIMsgBaseContent = Partial<WithDPUList> &
  Partial<WithRAGList> & {
    answer: string
    entities?: ChatEntityRecognize[]
    reasonContent?: string
    error?: string
    splTable?: SplTable[]
  }

/** 用户消息 */
export type UserMessageGEL = {
  role: 'user'
  content: string
}
/** AI消息 */
export type AIMessageGEL = {
  role: 'ai'
  content: AIMsgBaseContent | string
  status: AIMessageStatus
  footer?: ReactNode
}

/** 报告内容 AI 消息 */
export type AIMessageReportContent = {
  role: 'aiReportContent'
  content: string
  status: AIMessageStatus
  chapterId: string
}
export type AIHeaderMsg = {
  role: 'aiHeader'
  status: OtherMessageStatus
  content: ReactNode
  styles?: {
    content?: React.CSSProperties
  }
}

/** AI底部消息 */
export type AIFooterMsg = {
  role: 'aiFooter'
  status: OtherMessageStatus
  content: ReactNode
}

/** 建议消息 */
export type SuggestionMessage = {
  role: 'suggestion'
  content: WithDPUList & WithRAGList
  status: OtherMessageStatus
}

/** 文件消息 */
export type FileMessage = {
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
export type ChartMessage = {
  role: 'chart'
  content: GelData[]
  status: OtherMessageStatus
}
/** 简单图表消息 */
export type SimpleChartMessage = {
  role: 'simpleChart'
  content: AgentMsgAIOverall
  status: OtherMessageStatus
}
/** 超级名单表格消息 */
export type SplTableMessage = {
  role: 'splTable'
  content: SplTable[]
  status: OtherMessageStatus
}

/**
 * 基础聊天消息类型 这个类型是已解析处理过的 后端消息
 */
export type MsgParsedDepre =
  | UserMessageGEL
  | AIMessageGEL
  | AIHeaderMsg
  | SuggestionMessage
  | FileMessage
  | ChartMessage
  | SubQuestionMessage
  | SimpleChartMessage
  | SplTableMessage
  | AIFooterMsg
