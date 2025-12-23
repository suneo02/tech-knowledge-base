import { createContext, ReactNode, useCallback, useContext } from 'react'
import { CHAT_ROOM_ID_PREFIX, ChatRoomStateReturn, useChatRoomState } from './useChatRoomState'

export interface ChatRoomCtx extends ChatRoomStateReturn {
  updateRoomId: (id: string, index?: number) => void
}

export interface ChatProviderProps {
  children: ReactNode
  initialRoomId?: string
}

const ChatRoomContext = createContext<ChatRoomCtx | undefined>(undefined)

export const useChatRoomContext = () => {
  const context = useContext(ChatRoomContext)
  if (!context) {
    throw new Error('useChatRoomContext must be used within a ChatRoomProvider')
  }
  return context
}

export const ChatRoomProvider = ({ children, initialRoomId }: ChatProviderProps) => {
  const roomState = useChatRoomState(initialRoomId)

  // 使用 useCallback 稳定化 updateRoomId 函数，避免每次渲染都重新创建
  const updateRoomId = useCallback(
    (id: string, index?: number) => {
      roomState.setRoomId(id)
      roomState.setChatId(id.includes(CHAT_ROOM_ID_PREFIX) ? '' : id)
      if (typeof index === 'number') {
        roomState.setIndex(index)
      } else {
        roomState.resetIndex()
      }
    },
    [roomState.setRoomId, roomState.setChatId, roomState.setIndex, roomState.resetIndex]
  )

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
