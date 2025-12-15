import { createSuperlistRequestFcs } from '@/api/handleFcs'
import { useRequest } from 'ahooks'
import { CHAT_ROOM_ID_PREFIX, ChatRoomStateReturn, initRandomRoomId, useChatRoomState } from 'ai-ui'
import { isEmpty, isNil } from 'lodash'
import { createContext, Dispatch, ReactNode, SetStateAction, useCallback, useContext, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

export interface ConversationContextState extends ChatRoomStateReturn {
  conversationId: string
  setConversationId: Dispatch<SetStateAction<string>>
  updateRoomId: (id: string) => void
  resetConversation: () => void
  tableId: string
  noData: boolean
}

export const ConversationContext = createContext<ConversationContextState | undefined>(undefined)

export const useConversationContext = () => {
  const context = useContext(ConversationContext)
  if (!context) {
    throw new Error('useConversationContext must be used within a ConversationProvider')
  }
  return context
}

interface ConversationProviderProps {
  children: ReactNode
}

export const ConversationProvider = ({ children }: ConversationProviderProps) => {
  const { conversationId: conversationIdFromParam } = useParams()
  const roomState = useChatRoomState(conversationIdFromParam)
  const [conversationId, setConversationId] = useState<string>(conversationIdFromParam || '')
  const [tableId, setTableId] = useState('')
  const [noData, setNoData] = useState(false)

  const { run: getConversationDetail } = useRequest(createSuperlistRequestFcs('conversation/conversationDetail'), {
    onBefore: () => {
      setTableId('')
      setNoData(false)
    },
    onSuccess: (data) => {
      if (data.Data) {
        roomState.setChatId(data.Data.data.chatId)
      }
      if (data.Data && data.Data.data.tableId) {
        setTableId(data.Data.data.tableId)
      } else {
        setNoData(true)
      }
    },
    onError: () => {
      setNoData(true)
    },
    manual: true,
  })

  useEffect(() => {
    if (isNil(conversationIdFromParam) || isEmpty(conversationIdFromParam)) {
      resetConversation()
    } else if (conversationIdFromParam !== conversationId) {
      updateRoomId(conversationIdFromParam)
    }
  }, [conversationIdFromParam, conversationId])

  useEffect(() => {
    if (conversationId) {
      getConversationDetail({ conversationId })
    }
  }, [conversationId, getConversationDetail])

  const updateRoomId = useCallback(
    (id: string) => {
      roomState.setRoomId(id)
      setConversationId(id.includes(CHAT_ROOM_ID_PREFIX) ? '' : id)
    },
    [roomState]
  )

  const resetConversation = useCallback(() => {
    updateRoomId(initRandomRoomId())
    setTableId('')
    roomState.resetChatId()
    roomState.resetIsChating()
  }, [updateRoomId, roomState])

  const value = {
    ...roomState,
    conversationId,
    setConversationId,
    updateRoomId,
    resetConversation,
    tableId,
    noData,
  }

  return <ConversationContext.Provider value={value}>{children}</ConversationContext.Provider>
}
