import {
  AgentParam,
  ChatChatIdIdentifier,
  ChatEntityRecognize,
  ChatQuestionStatus,
  ChatRawSentenceIdentifier,
  ChatRawSentenceIdIdentifier,
  ChatTraceItem,
  ChatTypeEnum,
  GelData,
  ReportChatData,
  RPResponseProgress,
  SplTable,
  WithDPUList,
  WithRAGList,
} from 'gel-api'
import { ChatSenderOptions } from '../sender'
import { AIMessageStatus, OtherMessageStatus } from './common'

/**
 * 用户消息类型 所有 模块的 AI 聊天消息都应该继承自这个类型
 */
export interface AgentMsgUserOverall
  extends ChatSenderOptions,
    /**
     * 会话 id 目前不知道是否维护好，谨慎使用
     */
    ChatChatIdIdentifier,
    Partial<ChatRawSentenceIdIdentifier>,
    Partial<ChatRawSentenceIdentifier> {
  role: 'user'
  content: string
  status?: OtherMessageStatus
  agentParam?: AgentParam
}

/**
 * AI 消息类型 - 继承自 AgentMessageShared
 */
export interface AgentMsgAIShare
  extends ChatSenderOptions,
    /**
     * @deprecated 会话 id 不建议在 msg 中额外维护
     */
    Partial<ChatChatIdIdentifier>,
    Partial<ChatRawSentenceIdIdentifier>,
    Partial<ChatRawSentenceIdentifier> {
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
export type AgentMsgAIOverall = AgentMsgAIShare &
  Partial<WithDPUList> &
  Partial<WithRAGList> & {
    // AI 特有的字段
    entity?: ChatEntityRecognize[] // 实体信息
    traces?: ChatTraceItem[]
    gelData?: GelData[] // 图表数据
    // 超级名单表格数据
    splTable?: SplTable[] // 超级名单表格信息
    // 报告数据
    reportData?: ReportChatData
    chartType?: ChatTypeEnum // 图表类型
    /** 进度信息 - 用于展示 AIGC 生成进度 */
    progress?: RPResponseProgress
  }

/**
 * @deprecated
 *
 * 目前所有 模块都使用的是这个类似，待拆分出来，各个模块应该继承 AgentMessageShared
 * 建议使用 AgentMessageRaw 替代
 */
export type AgentMsgOverall = AgentMsgUserOverall | AgentMsgAIOverall
