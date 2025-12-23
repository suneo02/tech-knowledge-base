import { ChatEntityRecognize, GelData, SplTable, WithDPUList, WithRAGList } from 'gel-api'
import { ReactNode } from 'react'
import { AgentMsgAIDepre } from './agent'
import { AIMessageStatus, BaseMessageFields, OtherMessageStatus } from './common'

export type AIMsgBaseContent = Partial<WithDPUList> &
  Partial<WithRAGList> & {
    answer: string
    entities?: ChatEntityRecognize[]
    reasonContent?: string
    error?: string
    splTable?: SplTable[]
  }

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

/** 报告内容 AI 消息 */
export type AIMessageReportContent = BaseMessageFields & {
  role: 'aiReportContent'
  content: string
  status: AIMessageStatus
  chapterId: string
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
  content: WithDPUList & WithRAGList
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
  content: AgentMsgAIDepre
  status: OtherMessageStatus
}
/** 超级名单表格消息 */
export type SplTableMessage = BaseMessageFields & {
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
