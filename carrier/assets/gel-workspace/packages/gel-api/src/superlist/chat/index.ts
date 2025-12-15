import { ChatRawSentenceIdentifier } from '@/chat'
import type {
  AiRenameConversationRequest,
  AiRenameConversationResponse,
  ApiPageParamForSuperlist,
  ApiResponseForSuperlist,
  ApiResponseForSuperlistWithPage,
} from '@/superlist/types'
import { SuperListAddConversationPayload, SuperListAddConversationResponse } from './addConversation'
export * from './addConversation'

export interface SuperChatHistoryItem {
  conversationId: string
  conversationName: string
  updateTime: string
  companySheetFromCde: boolean
}

export interface superlistChatApiPathMap {
  'conversation/conversationList': {
    data: ApiPageParamForSuperlist
    response: ApiResponseForSuperlistWithPage<SuperChatHistoryItem>
  }
  'conversation/conversationDetail': {
    data: {
      conversationId: string
    }
    response: ApiResponseForSuperlist<{
      data: {
        chatId: string
        tableId: string
      }
    }>
  }
  'conversation/addConversation': {
    data: SuperListAddConversationPayload
    response: ApiResponseForSuperlist<{
      data: SuperListAddConversationResponse
    }>
  }
  'conversation/delConversation': {
    data: {
      conversationId: string
    }
    response: ApiResponseForSuperlist
  }
  // 重命名会话
  'conversation/renameConversation': {
    data: {
      conversationId: string
      conversationName: string
    }
    response: ApiResponseForSuperlist
  }
  // 获取 会话/表格 的AI生成的结果
  'chat/aiRenameConversation': {
    data: AiRenameConversationRequest
    response: ApiResponseForSuperlist<AiRenameConversationResponse>
  }
  'chat/questionGuide': {
    data: {
      text: string
    } & ChatRawSentenceIdentifier
    response: ApiResponseForSuperlistWithPage<string>
  }
}
