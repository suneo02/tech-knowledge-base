import { MessageParsedCore, QuestionGuideMessage, SmartTableMessage } from './parsed'
import { MessageRawCore } from './raw'

export * from './common'
export * from './parsed'
export * from './raw'

/**
 * 基础聊天消息类型 这个类型是已解析处理过的 后端消息
 */
export type MessageParsedBase = MessageParsedCore

/**
 * 超级聊天消息类型 这个类型是已解析处理过的 后端消息
 */
export type MessageParsedSuper = MessageParsedBase | QuestionGuideMessage | SmartTableMessage

/**
 * 基础聊天消息类型 这个类型是未被解析处理过的 后端消息
 */
export type MessageRaw = MessageRawCore

/**
 * 超级聊天消息类型 这个类型是未被解析处理过的 后端消息
 */
export type MessageRawSuper = MessageRawCore & {
  questionGuide?: string[]
}
