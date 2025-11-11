import { ChatThinkSignal } from 'gel-api'
import { getAllUrlSearch } from 'gel-util/common'
import { useEffect, useRef, useState } from 'react'

export const initialMessageKeyMap = {
  initialMsg: 'initialMsg',
  initialDeepthink: 'initialDeepthink',
  initialFiles: 'initialFiles',
  initialRefFiles: 'initialRefFiles',
}

interface FileItem {
  fileId: string
  fileName?: string
  uploadTime: string
}

interface UseInitialMessageResult {
  initialMessage: string | null
  initialDeepthink: ChatThinkSignal['think'] | undefined
  // 新增字段，表示是否从URL中获取了初始消息
  hasInitialMessage: boolean
  // 新增字段，表示初始文件列表
  initialFiles?: FileItem[]
  // 新增字段，表示初始引用文件列表
  initialRefFiles?: FileItem[]
}

/**
 * 获取初始消息和深度思考模式
 *
 * 从 URL 查询参数中获取初始消息和深度思考模式
 * 同时提供标记表示是否存在初始消息，用于判断是否应该恢复历史消息
 *
 * @deprecated 待优化，目前配置较为固定
 */
export const useInitialMsgFromUrl = (): UseInitialMessageResult => {
  const [initialState, setInitialState] = useState<UseInitialMessageResult>({
    initialMessage: null,
    initialDeepthink: undefined,
    hasInitialMessage: false,
    initialFiles: undefined,
    initialRefFiles: undefined,
  })

  const hasProcessedParams = useRef(false)

  useEffect(() => {
    if (!hasProcessedParams.current) {
      const queryParams = getAllUrlSearch()

      // 处理 deepthink 参数
      let deepthinkFromUrl: ChatThinkSignal['think'] | undefined = undefined
      if (
        queryParams[initialMessageKeyMap.initialDeepthink] &&
        typeof queryParams[initialMessageKeyMap.initialDeepthink] === 'string'
      ) {
        const deepthinkValue = Number(queryParams[initialMessageKeyMap.initialDeepthink])
        if (deepthinkValue === 1) {
          deepthinkFromUrl = 1
        }
      }

      // 处理 initialFiles 参数
      let initialFilesFromUrl: FileItem[] | undefined = undefined
      if (
        queryParams[initialMessageKeyMap.initialFiles] &&
        typeof queryParams[initialMessageKeyMap.initialFiles] === 'string'
      ) {
        try {
          const parsedFiles = JSON.parse(queryParams[initialMessageKeyMap.initialFiles])
          if (Array.isArray(parsedFiles)) {
            initialFilesFromUrl = parsedFiles.map((file) => ({
              ...file,
              uploadTime: file.uploadTime,
            }))
          }
        } catch (error) {
          console.error('Failed to parse initialFiles from URL:', error)
        }
      }

      // 处理 initialRefFiles 参数
      let initialRefFilesFromUrl: FileItem[] | undefined = undefined
      if (
        queryParams[initialMessageKeyMap.initialRefFiles] &&
        typeof queryParams[initialMessageKeyMap.initialRefFiles] === 'string'
      ) {
        try {
          const parsedRefFiles = JSON.parse(queryParams[initialMessageKeyMap.initialRefFiles])
          if (Array.isArray(parsedRefFiles)) {
            initialRefFilesFromUrl = parsedRefFiles.map((file) => ({
              ...file,
              uploadTime: file.uploadTime,
            }))
          }
        } catch (error) {
          console.error('Failed to parse initialRefFiles from URL:', error)
        }
      }

      setInitialState({
        initialMessage: queryParams[initialMessageKeyMap.initialMsg],
        initialDeepthink: deepthinkFromUrl,
        hasInitialMessage: !!queryParams[initialMessageKeyMap.initialMsg],
        initialFiles: initialFilesFromUrl,
        initialRefFiles: initialRefFilesFromUrl,
      })

      hasProcessedParams.current = true
    }
  }, [])

  return initialState
}
