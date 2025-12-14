import { ConversationsProps } from '@ant-design/x'
import { SuperChatHistoryItem } from 'gel-api'
import { groupConversation } from './handle'
import { EDBO } from '@wind/rime-icons'
import { MessageO } from '@wind/icons'

/**
 * 处理会话列表的渲染
 */

export const processSuperConversations = (conversations: SuperChatHistoryItem[]): ConversationsProps['items'] => {
  return conversations.map((conversation) => {
    return {
      ...groupConversation(conversation),
      key: conversation.conversationId?.toString(),
      label: conversation.conversationName || `对话 ${conversation.conversationId}`,
      icon: conversation.companySheetFromCde ? (
        // @ts-expect-error wind-icon
        <EDBO style={{ color: 'var(--basic-10)', fontSize: 16 }} />
      ) : (
        // @ts-expect-error wind-icon
        <MessageO style={{ color: 'var(--basic-10)', width: 16 }} />
      ),
    }
  })
}
