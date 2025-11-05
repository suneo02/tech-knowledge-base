import { local } from '@/utils'
import { MessageRaw } from 'ai-ui'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

interface UseInitialMessageResult {
  initialMessage: string | null
  initialDeepthink: MessageRaw['think'] | null
  entityType: string | null
  entityName: string | null
  roomId: string | null
}

export const useInitialMessage = (): UseInitialMessageResult => {
  const [initialMessage, setInitialMessage] = useState<string | null>(null)
  const [initialDeepthink, setInitialDeepthink] = useState<MessageRaw['think'] | null>(null)
  const [entityType, setEntityType] = useState<string | null>(null)
  const [entityName, setEntityName] = useState<string | null>(null)
  const [roomId, setRoomId] = useState<string | null>(null)

  const [searchParams] = useSearchParams()

  useEffect(() => {
    // 如果搜索参数有初始消息，则返回初始消息
    const initMsg = searchParams.get('initialMsg')
    const initDeepthink = searchParams.get('initialDeepthink') === '1' ? 1 : undefined
    const urlEntityType = searchParams.get('entityType')

    const urlEntityName = searchParams.get('entityName')
    console.log('🚀 ~ useEffect ~ urlEntityType:', urlEntityType, urlEntityName)
    if (initMsg || initDeepthink || urlEntityType || urlEntityName) {
      setEntityType(urlEntityType)
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

// 旧的初始化消息方案 local方式时问句会不显示，原因未知，后续有空排查
// export const useInitialMessage = (): UseInitialMessageResult => {
//   const [searchParams] = useSearchParams()

//   const initialMessage = searchParams.get('initialMsg')
//   const initialDeepthink = searchParams.get('initialDeepthink')

//   // 如果搜索参数有初始消息，则返回初始消息
//   if (initialMessage) {
//     return {
//       initialMessage,
//       initialDeepthink: initialDeepthink === '1' ? 1 : undefined,
//     }
//   }

//   // 如果本地存储有初始消息，则返回初始消息
//   const storedMessage = local.get('chat_initial_message')
//   if (storedMessage) {
//     local.remove('chat_initial_message')
//   }

//   const initialMessageStorage = typeof storedMessage === 'string' ? storedMessage : (storedMessage?.message ?? null)

//   const initialDeepthinkStorage = typeof storedMessage === 'object' ? (storedMessage?.think ?? null) : null

//   return {
//     initialMessage: initialMessageStorage,
//     initialDeepthink: initialDeepthinkStorage,
//   }
// }
