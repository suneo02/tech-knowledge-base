/**
 * 解析后消息类型定义
 *
 * 定义流水线第三阶段的解析后消息类型
 * 这些消息是从 AgentMessage 解析而来，准备渲染到 UI
 *
 * 设计原则：
 * - 使用交叉类型，保持与现有 parsed.ts 的设计一致
 * - ParsedMessage 可以继承 BaseMessage，因为它们是最终的 UI 消息
 * - 包含完整的 AI 输出内容和 UI 渲染所需的字段
 */

import type { ChatEntityRecognize, GelData, SplTable, WithDPUList, WithRAGList } from 'gel-api'
import type { ReactNode } from 'react'
// BaseMessage 在三段式架构中不再被 ParsedMessage 使用
import type { AgentMessageFields, AIMessageStatus, OtherMessageStatus } from './agentMessages'
import type { AIOutputContent } from './config'

// ==================== Parsed 消息基础字段 ====================

/**
 * 解析后消息的基础字段 - 基于现有 BaseMessageFields
 * 包含 UI 渲染所需的完整字段
 */
export interface ParsedMessageFields extends AgentMessageFields {
  /** 原始句子内容 及用户问句 */
  rawSentence?: string
}

// ==================== 解析后消息类型 ====================

/**
 * AI 消息基础内容 - 基于现有 AIMsgBaseContent
 * 包含 AI 输出的核心内容
 */
export interface AIMsgBaseContent extends AIOutputContent {
  /** AI 回答的主要内容 */
  answer: string
  /** 推理内容 */
  reasonContent?: string
  /** 错误信息 */
  error?: string
  /** 实体信息 - 重新定义以保持兼容性 */
  entities?: ChatEntityRecognize[]
  /** 超级名单表格 - 重新定义以保持兼容性 */
  splTable?: SplTable[]
}

/**
 * 用户消息 - 基于现有 UserMessageGEL
 */
export type ParsedUserMessage = ParsedMessageFields & {
  role: 'user'
  content: string
}

/**
 * AI消息 - 基于现有 AIMessageGEL
 */
export type ParsedAIMessage = ParsedMessageFields & {
  role: 'ai'
  content: AIMsgBaseContent | string
  status: AIMessageStatus
}

/**
 * 报告内容 AI 消息 - 基于现有 AIMessageReportContent
 */
export type ParsedAIReportMessage = ParsedMessageFields & {
  role: 'aiReportContent'
  content: string
  status: AIMessageStatus
  chapterId: string
}

/**
 * AI 头部消息 - 基于现有 AIHeaderMsg
 */
export type ParsedAIHeaderMessage = ParsedMessageFields & {
  role: 'aiHeader'
  status: OtherMessageStatus
  content: ReactNode
  styles?: {
    content?: React.CSSProperties
  }
}

/**
 * 建议消息 - 基于现有 SuggestionMessage
 */
export type ParsedSuggestionMessage = ParsedMessageFields & {
  role: 'suggestion'
  content: WithDPUList & WithRAGList
  status: OtherMessageStatus
}

/**
 * 文件消息 - 基于现有 FileMessage
 */
export type ParsedFileMessage = ParsedMessageFields & {
  role: 'file'
  content: string
  status: OtherMessageStatus
}

/**
 * 子问题消息 - 基于现有 SubQuestionMessage
 */
export type ParsedSubQuestionMessage = ParsedMessageFields & {
  role: 'subQuestion'
  content: string[]
  status: OtherMessageStatus
}

/**
 * 图表消息 - 基于现有 ChartMessage
 */
export type ParsedChartMessage = ParsedMessageFields & {
  role: 'chart'
  content: GelData[]
  status: OtherMessageStatus
}

/**
 * 简单图表消息 - 基于现有 SimpleChartMessage
 */
export type ParsedSimpleChartMessage = ParsedMessageFields & {
  role: 'simpleChart'
  content: any // 保持与现有设计一致
  status: OtherMessageStatus
}

/**
 * 超级名单表格消息 - 基于现有 SplTableMessage
 */
export type ParsedSplTableMessage = ParsedMessageFields & {
  role: 'splTable'
  content: SplTable[]
  status: OtherMessageStatus
}

// ==================== 联合类型 ====================

/**
 * 所有解析后的消息类型
 */
export type AllParsedMessages =
  | ParsedUserMessage
  | ParsedAIMessage
  | ParsedAIHeaderMessage
  | ParsedSuggestionMessage
  | ParsedFileMessage
  | ParsedChartMessage
  | ParsedSubQuestionMessage
  | ParsedSimpleChartMessage
  | ParsedSplTableMessage
  | ParsedAIReportMessage

// ==================== 三段式流水线类型 ====================

/**
 * 解析后消息类型（渲染消息）- 流水线第三阶段
 *
 * 设计说明：
 * - 使用联合类型表示所有可能的解析后消息
 * - 这些消息已经包含完整的 UI 渲染信息
 * - 可以直接用于 UI 组件渲染
 */
export type ParsedMessage = AllParsedMessages
