import { AIChatHistory, SuperChatHistoryItem } from 'gel-api'
import { ConversationTimeGroup } from 'gel-ui'
import { createConversationsContext } from './core'
export { createConversationsContext } from './core'

// Create the context using the factory
export const { useConversations: useConversationsBase, Provider: ConversationsBaseProvider } =
  createConversationsContext<
    AIChatHistory & {
      group?: ConversationTimeGroup
    }
  >()

// Create the context using the factory
export const { useConversations: useConversationsSuper, Provider: ConversationsSuperProvider } =
  createConversationsContext<
    SuperChatHistoryItem & {
      group?: ConversationTimeGroup
      splVersion?: number
    }
  >()
