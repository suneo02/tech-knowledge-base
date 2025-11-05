import { ChatHistoryResponse, SuperChatHistoryItem } from 'gel-api'
import { createConversationsContext } from './core'
import { ConversationTimeGroup } from './type'
export * from './core'
export * from './type'

// Create the context using the factory
export const { useConversations: useConversationsBase, Provider: ConversationsBaseProvider } =
  createConversationsContext<
    ChatHistoryResponse & {
      group?: ConversationTimeGroup
    }
  >()

// Create the context using the factory
export const { useConversations: useConversationsSuper, Provider: ConversationsSuperProvider } =
  createConversationsContext<
    SuperChatHistoryItem & {
      group?: ConversationTimeGroup
    }
  >()
