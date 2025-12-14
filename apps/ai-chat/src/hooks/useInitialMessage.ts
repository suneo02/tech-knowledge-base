import { local } from '@/utils'
import { ChatEntityType, ChatThinkSignal } from 'gel-api'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UseInitialMessageResult {
  initialMessage: string | null
  initialDeepthink: ChatThinkSignal['think'] | null
  entityType: ChatEntityType | null
  entityName: string | null
  roomId: string | null
}

export const useInitialMessage = (): UseInitialMessageResult => {
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  const [initialDeepthink, setInitialDeepthink] = useState<ChatThinkSignal['think'] | null>(null)
  const [entityType, setEntityType] = useState<ChatEntityType | null>(null)
  const [entityName, setEntityName] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    // 如果搜索参数有初始消息，则返回初始消息
    const initMsg = searchParams.get('initialMsg')
    const initDeepthink = searchParams.get('initialDeepthink') === '1' ? 1 : undefined
    const urlEntityType = searchParams.get('entityType')

    const urlEntityName = searchParams.get('entityName')
    // console.log('🚀 ~ useEffect ~ urlEntityType:', urlEntityType, urlEntityName)
    if (initMsg || initDeepthink || urlEntityType || urlEntityName) {
      setEntityType(urlEntityType as ChatEntityType)
      setEntityName(urlEntityName)
      setInitialMessage(initMsg)
      setInitialDeepthink(initDeepthink)
      setRoomId(searchParams.get('roomId'))
    } else {
      // 如果本地存储有初始消息，则返回初始消息
      const storedMessage = local.get('chat_initial_message')
      if (storedMessage) {
        local.remove('chat_initial_message')
      }
      const initialMessageStorage = typeof storedMessage === 'string' ? storedMessage : (storedMessage?.message ?? null)

      const initialDeepthinkStorage = typeof storedMessage === 'object' ? (storedMessage?.think ?? null) : null

      setInitialDeepthink(initialDeepthinkStorage)
      setInitialMessage(initialMessageStorage)
    }
  }, [initialMessage, searchParams])

  return {
    initialMessage,
    initialDeepthink,
    entityType,
    entityName,
    roomId,
  }
}
