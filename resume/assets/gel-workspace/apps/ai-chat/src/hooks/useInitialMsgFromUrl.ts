import { MessageRaw } from 'ai-ui'
import qs from 'qs'
import { useEffect, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'

interface UseInitialMessageResult {
  initialMessage: string | null
  initialDeepthink: MessageRaw['think'] | undefined
  // 新增字段，表示是否从URL中获取了初始消息
  hasInitialMessage: boolean
}

/**
 * 获取初始消息和深度思考模式
 *
 * 从 URL 查询参数中获取初始消息和深度思考模式
 * 同时提供标记表示是否存在初始消息，用于判断是否应该恢复历史消息
 */
export const useInitialMsgFromUrl = (): UseInitialMessageResult => {
  const location = useLocation()
  // 用于存储初始状态，防止 URL 被清空后丢失信息
  const [initialState, setInitialState] = useState<{
    message: string | null
    deepthink: MessageRaw['think'] | undefined
    hasInitialMessage: boolean
  }>({
    message: null,
    deepthink: undefined,
    hasInitialMessage: false,
  })
  // 标记是否已经处理过URL参数
  const hasProcessedParams = useRef(false)

  useEffect(() => {
    // 只在组件首次挂载或 URL 变化且未处理过时处理参数
    if (!hasProcessedParams.current || location.search) {
      // 从 URL 查询参数中获取
      const queryParams = qs.parse(location.search.substring(1))
      const messageFromUrl = typeof queryParams.initialMsg === 'string' ? queryParams.initialMsg : null

      // 处理 deepthink 参数，确保类型正确
      let deepthinkFromUrl: MessageRaw['think'] | undefined = undefined
      if (queryParams.initialDeepthink && typeof queryParams.initialDeepthink === 'string') {
        const deepthinkValue = Number(queryParams.initialDeepthink)
        if (deepthinkValue === 1) {
          deepthinkFromUrl = 1
        }
      }

      // 记录初始状态
      setInitialState({
        message: messageFromUrl,
        deepthink: deepthinkFromUrl,
        hasInitialMessage: !!messageFromUrl,
      })

      // 标记已处理
      hasProcessedParams.current = true
    }
  }, [location.search])

  return {
    initialMessage: initialState.message,
    initialDeepthink: initialState.deepthink,
    hasInitialMessage: initialState.hasInitialMessage,
  }
}
