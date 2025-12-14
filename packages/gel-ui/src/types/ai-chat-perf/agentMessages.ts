/**
 * Agent 消息类型定义
 *
 * 定义流水线第二阶段的 Agent 消息类型
 * 这些消息是从 ChatSendInput 转换而来，准备进入解析阶段
 *
 * 设计原则：
 * - Agent 消息不继承 BaseMessage，使用交叉类型
 * - 保持与现有 agent.ts 的设计一致性
 * - 简化字段，只保留 Agent 阶段必需的字段
 */

import type {
  AgentIdentifiers,
  AgentParam,
  ChatChatIdIdentifier,
  ChatQuestionStatus,
  ChatRawSentenceIdIdentifier,
} from 'gel-api'
import type { ReactNode } from 'react'

// ==================== 消息状态类型 ====================

/** AI消息状态 */
export type AIMessageStatus = 'pending' | 'receiving' | 'stream_finish' | 'finish'

/** 其他消息状态（除了user和ai） */
export type OtherMessageStatus = 'pending' | 'finish'

// ==================== Agent 基础字段 ====================

/**
 * Agent 消息的基础字段 - 基于现有 BaseMessageFields 简化
 * 只保留 Agent 阶段真正需要的字段
 */
export interface AgentMessageFields extends Partial<ChatRawSentenceIdIdentifier>, Pick<AgentIdentifiers, 'agentId'> {
  /** 消息ID */
  id?: string
  /** 时间戳 */
  timestamp?: number
  /** 消息底部附加内容 */
  footer?: ReactNode
}

// ==================== Agent 消息类型 ====================

/**
 * 用户消息类型 - 基于现有 AgentMsgUserShare
 * 使用交叉类型，保持与现有设计一致
 */
export type AgentUserMessage = AgentMessageFields &
  /** 会话 id 目前不知道是否维护好，谨慎使用 */

  ChatChatIdIdentifier & {
    role: 'user'
    content: string
    status?: OtherMessageStatus
    agentParam?: AgentParam
  }

/**
 * AI 消息类型 - 基于现有 AgentMsgAIShare
 * 使用交叉类型，保持与现有设计一致
 */
export type AgentAIMessage = AgentMessageFields &
  ChatChatIdIdentifier & {
    role: 'ai'
    content?: string
    reasonContent?: string
    questionStatus?: ChatQuestionStatus
    subQuestion?: string[] // 问句拆解
    error?: string // 错误信息
    /** 消息状态 pending 正在处理，receiving 正在接收， stream_finish 流式输出完成， finish 处理完成 */
    status?: AIMessageStatus
  }

// ExtendedAgentAIMessage 已移除
// 原因：Agent 阶段不应该包含过多的 AI 输出字段
// 这些字段应该在 ParsedMessage 阶段处理

// ==================== 联合类型 ====================

/**
 * 所有 Agent 消息类型 - 基于现有 AgentMessageShared
 */
export type AllAgentMessages = AgentUserMessage | AgentAIMessage

// ==================== 三段式流水线类型 ====================

/**
 * 代理消息类型（中间消息）- 流水线第二阶段
 *
 * 设计说明：
 * - 不再继承 BaseMessage，因为 Agent 消息有自己的结构
 * - 使用联合类型表示所有可能的 Agent 消息
 * - 保持简洁，只包含 Agent 阶段必需的字段
 */
export type AgentMessage = AllAgentMessages
