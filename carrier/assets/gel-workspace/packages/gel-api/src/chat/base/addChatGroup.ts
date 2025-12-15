import { ChatChatIdIdentifier, ChatRawSentenceIdentifier } from '../types'

// 创建会话请求参数
export interface AddChatGroupRequest extends ChatRawSentenceIdentifier {
  entityCode?: string // 企业详情页创建需传入code
}

// 创建会话响应
export interface AddChatGroupResponse extends ChatChatIdIdentifier {
  chatTitle: string
}
