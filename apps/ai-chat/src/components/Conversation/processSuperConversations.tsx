import { ConversationsProps } from '@ant-design/x'
import { SuperChatHistoryItem } from 'gel-api'
import { groupConversation } from './handle'

/**
 * 处理会话列表的渲染
 */

export const processSuperConversations = (conversations: SuperChatHistoryItem[]): ConversationsProps['items'] => {
  return conversations.map((conversation) => {
    return {
      ...groupConversation(conversation),
      key: conversation.conversationId?.toString(),
      label: conversation.conversationName || `对话 ${conversation.conversationId}`,
    }
  })
}
