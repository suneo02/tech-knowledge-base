import { ConversationTimeGroup, ConversationTimeGroupMap } from 'gel-ui'
import React, { createContext, useContext, useState } from 'react'

// Define a base interface for conversation items
export interface BaseConversationItem {
  group?: ConversationTimeGroup
}

// Generic context type
export interface ConversationsContextType<T extends BaseConversationItem> {
  conversationsItems: T[]
  addConversationItem: (newConversation: T) => void
  updateConversationsItems: (conversations: T[]) => void
}

// Create a function to generate contexts for different conversation types
export function createConversationsContext<T extends BaseConversationItem>() {
  // Create the context with proper type parameter
  const Context = createContext<ConversationsContextType<T> | undefined>(undefined)

  // Create a typed hook
  const useConversations = () => {
    const context = useContext(Context)
    if (!context) {
      throw new Error('Conversations context must be used within its provider')
    }
    return context as ConversationsContextType<T>
  }

  // Create a provider component
  const Provider: React.FC<{
    children: React.ReactNode
    initialItems?: T[]
    defaultGroup?: ConversationTimeGroup
  }> = ({ children, initialItems = [], defaultGroup = ConversationTimeGroupMap.TODAY }) => {
    const [conversationsItems, setConversationsItems] = useState<T[]>(initialItems)

    const addConversationItem = (newConversation: T) => {
      console.log('🚀 ~ addConversationItem ~ newConversation:', newConversation)
      setConversationsItems((prevItems) => [
        { ...newConversation, group: newConversation.group || defaultGroup },
        ...prevItems,
      ])
    }

    const updateConversationsItems = (conversations: T[]) => {
      console.log('🚀 ~ updateConversationsItems ~ conversations:', conversations)
      setConversationsItems(conversations)
    }

    return (
      <Context.Provider value={{ conversationsItems, addConversationItem, updateConversationsItems }}>
        {children}
      </Context.Provider>
    )
  }

  return { Context, useConversations, Provider }
}
