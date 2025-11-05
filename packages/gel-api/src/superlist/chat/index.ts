import { ApiPageParamForSuperlist, ApiResponseForSuperlist, ApiResponseForSuperlistWithPage } from '@/superlist/config'
import { SuperListAddConversationPayload, SuperListAddConversationResponse } from './addConversation'
export * from './addConversation'

export interface SuperChatHistoryItem {
  conversationId: string
  conversationName: string
  updateTime: string
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
  'chat/questionGuide': {
    data: {
      rawSentence: string
      text: string
    }
    response: ApiResponseForSuperlistWithPage<string>
  }
}
