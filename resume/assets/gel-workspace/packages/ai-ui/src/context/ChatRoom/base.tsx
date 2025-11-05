import { createContext, ReactNode, useContext, useCallback } from 'react'
import { CHAT_ROOM_ID_PREFIX, ChatRoomStateReturn, useChatRoomState } from './useChatRoomState'

export interface ChatRoomCtx extends ChatRoomStateReturn {
  updateRoomId: (id: string) => void
}

export interface ChatProviderProps {
  children: ReactNode
}

const ChatRoomContext = createContext<ChatRoomCtx | undefined>(undefined)

export const useChatRoomContext = () => {
  const context = useContext(ChatRoomContext)
  if (!context) {
    throw new Error('useChatRoomBaseContext must be used within a ChatRoomProvider')
  }
  return context
}

export const ChatRoomProvider = ({ children }: ChatProviderProps) => {
  const roomState = useChatRoomState()

  // 使用 useCallback 稳定化 updateRoomId 函数，避免每次渲染都重新创建
  const updateRoomId = useCallback((id: string) => {
    console.log('🚀 ~ updateRoomId ~ id:', id)
    roomState.setRoomId(id)
    roomState.setChatId(id.includes(CHAT_ROOM_ID_PREFIX) ? '' : id)
  }, [roomState.setRoomId, roomState.setChatId])

  return (
    <ChatRoomContext.Provider
      value={{
        ...roomState,
        updateRoomId,
      }}
    >
      {children}
    </ChatRoomContext.Provider>
  )
}
