import {
  AgentMsgAIDepre,
  AgentMsgUserShare,
  BaseMessageFields,
  MsgParsedDepre,
  OtherMessageStatus,
} from '../ai-chat/message'

/** 问答引导消息 */
export type QuestionGuideMessage = BaseMessageFields & {
  role: 'questionGuide'
  content: string[]
  status: OtherMessageStatus
}

/** 智能表格消息 */
export type SmartTableMessage = BaseMessageFields & {
  role: 'smartTable'
  content: string[]
  status: OtherMessageStatus
}

/**
 * 超级聊天消息类型 这个类型是已解析处理过的 后端消息
 */
export type SPMsgParsed = MsgParsedDepre | QuestionGuideMessage | SmartTableMessage

export type SPAgentMsgAI = AgentMsgAIDepre & {
  questionGuide?: string[]
}

export type SPUserMsgUser = AgentMsgUserShare & {
  questionGuide?: string[]
}
/**
 * 超级聊天消息类型 这个类型是未被解析处理过的 后端消息
 */
export type SPAgentMsg = SPUserMsgUser | SPAgentMsgAI
