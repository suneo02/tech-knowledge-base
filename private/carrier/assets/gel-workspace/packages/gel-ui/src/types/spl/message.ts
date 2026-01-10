import { AgentMsgAIOverall, AgentMsgUserOverall, MsgParsedDepre, OtherMessageStatus } from '../ai-chat/message'

/** 智能表格消息 */
export type SmartTableMessage = {
  role: 'smartTable'
  content: string[]
  status: OtherMessageStatus
}

/**
 * 超级聊天消息类型 这个类型是已解析处理过的 后端消息
 */
export type SPMsgParsed = MsgParsedDepre | SmartTableMessage

export type SPAgentMsgAI = AgentMsgAIOverall

export type SPUserMsgUser = AgentMsgUserOverall
/**
 * 超级聊天消息类型 这个类型是未被解析处理过的 后端消息
 */
export type SPAgentMsg = SPUserMsgUser | SPAgentMsgAI
