import {
  AgentParam,
  ChatChatIdIdentifier,
  ChatEntityRecognize,
  ChatQuestionStatus,
  ChatTypeEnum,
  GelData,
  ReportChatData,
  SplTable,
  WithDPUList,
  WithRAGList,
} from 'gel-api'
import { AIMessageStatus, BaseMessageFields, OtherMessageStatus } from './common'

/**
 * 用户消息类型 所有 模块的 AI 聊天消息都应该继承自这个类型
 */
export type AgentMsgUserShare = BaseMessageFields &
  /**
   * 会话 id 目前不知道是否维护好，谨慎使用
   */
  ChatChatIdIdentifier & {
    role: 'user'
    content: string
    status?: OtherMessageStatus
    agentParam?: AgentParam
  }

/**
 * AI 消息类型 - 继承自 AgentMessageShared
 */
export type AgentMsgAIShare = BaseMessageFields &
  /**
   * 会话 id 目前不知道是否维护好，谨慎使用
   */
  Partial<ChatChatIdIdentifier> & {
    role: 'ai'
    content?: string
    reasonContent?: string
    questionStatus?: ChatQuestionStatus
    subQuestion?: string[] // 问句拆解
    error?: string // 错误信息
    // 消息状态 pending 正在处理，receiving 正在接收， stream_finish 流式输出完成， finish 处理完成
    status?: AIMessageStatus
  }

/**
 * AI 消息类型 - 继承自 AgentMessageShared
 * @deprecated 待细化到各个模块
 */
export type AgentMsgAIDepre = AgentMsgAIShare &
  Partial<WithDPUList> &
  Partial<WithRAGList> & {
    // AI 特有的字段
    entity?: ChatEntityRecognize[] // 实体信息
    gelData?: GelData[] // 图表数据
    // 超级名单表格数据
    splTable?: SplTable[] // 超级名单表格信息
    // 报告数据
    reportData?: ReportChatData
    chartType?: ChatTypeEnum // 图表类型
    questionGuide?: string[] // 问答引导
  }
/**
 * 所有 Agent 消息的联合类型
 */
export type AgentMessageShared = AgentMsgUserShare | AgentMsgAIShare

/**
 * @deprecated
 *
 * 目前所有 模块都使用的是这个类似，待拆分出来，各个模块应该继承 AgentMessageShared
 * 建议使用 AgentMessageRaw 替代
 */
export type AgentMsgDepre = AgentMsgUserShare | AgentMsgAIDepre
