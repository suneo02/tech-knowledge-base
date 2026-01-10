import {
  AgentIdentifiers,
  AgentParam,
  ChatClientTypeIdentifier,
  ChatEntityType,
  ChatModelTypeIdentifier,
  ChatReviewSignal,
  ChatThinkSignal,
  DeepSearchSignal,
} from 'gel-api'

/** 实体参数选项 各详情页用 */
export type EntityOptions = {
  entityType?: ChatEntityType
  entityName?: string
  entityCode?: string
}

export interface ChatMsgInputOptions
  extends Pick<AgentIdentifiers, 'agentId'>,
    ChatThinkSignal,
    EntityOptions,
    ChatReviewSignal,
    ChatClientTypeIdentifier,
    ChatModelTypeIdentifier,
    DeepSearchSignal {
  /** 代理参数 - 代理的具体配置参数 */
  agentParam?: AgentParam
}

/** AI消息状态 */
export type AIMessageStatus = 'pending' | 'receiving' | 'stream_finish' | 'finish'
/** 其他消息状态（除了user和ai） */
export type OtherMessageStatus = 'pending' | 'finish'
