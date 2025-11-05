import { EntityOptions } from '@/hooks/conversationSetup/types'
import { AgentIdentifiers, ChatThinkSignal } from 'gel-api'
import { ReactNode } from 'react'

/** 所有消息共享的基础属性 */
export type BaseMessageFields = {
  /** 消息底部附加内容 */
  footer?: ReactNode
  /** 原始句子内容 及用户问句 */
  rawSentence?: string
  /** 原始句子ID 即用户问句的ID */
  rawSentenceID?: string
} & Pick<AgentIdentifiers, 'agentId'> &
  ChatThinkSignal &
  EntityOptions
