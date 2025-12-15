import {
  AgentIdentifiers,
  ChatModelTypeIdentifier,
  ChatRawSentenceIdentifier,
  ChatRawSentenceIdIdentifier,
  ChatThinkSignal,
  DeepSearchSignal,
} from 'gel-api'
import { ReactNode } from 'react'
import { EntityOptions } from '../sender'

/** 所有消息共享的基础属性 */
export type BaseMessageFields = {
  /** 消息底部附加内容 */
  footer?: ReactNode
} & Pick<AgentIdentifiers, 'agentId'> &
  ChatThinkSignal &
  EntityOptions &
  ChatModelTypeIdentifier &
  DeepSearchSignal &
  Partial<ChatRawSentenceIdIdentifier> &
  Partial<ChatRawSentenceIdentifier>

/** AI消息状态 */
export type AIMessageStatus = 'pending' | 'receiving' | 'stream_finish' | 'finish'
/** 其他消息状态（除了user和ai） */
export type OtherMessageStatus = 'pending' | 'finish'
