import { filterTracesByValidSource, processTextWithEntities, processTextWithTraces } from '@/md'
import { MessageRaw } from '@/types/message'
import { ERROR_TEXT } from '@/util'
import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { ChatRestoreResponse, createChatRequestWithAxios } from 'gel-api'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

/**
 * 将 selectChatAIRecord 数据转换为 bubble list
 * @param chatRestoreRes selectChatAIRecord 返回的数据
 * @returns 转换后的消息列表
 */
export const transformChatRestoreToRawMessages = (chatRestoreRes: ChatRestoreResponse[]): MessageInfo<MessageRaw>[] => {
  if (!chatRestoreRes) {
    return []
  }

  const bubbleList: MessageInfo<MessageRaw>[] = []
  chatRestoreRes.forEach((item) => {
    const { questionsID, questions, questionStatus, answers, data, think, entity, traceContent, groupId } = item

    if (questionsID) {
      bubbleList.push({
        id: questionsID,
        message: {
          role: 'user',
          content: questions,
          chatId: groupId,
          think: (think?.length ?? 0 > 0) ? 1 : undefined,
        },
        status: 'success',
      })
    }

    if (answers || questionStatus != null) {
      let tracesContent = answers

      const dpuTableLength = data?.result?.content?.data?.length || 0
      const suggestItems = data?.result?.suggest?.items || []
      if (traceContent && traceContent?.length > 0) {
        // 根据有效来源过滤溯源标记数据
        const tracesRes = filterTracesByValidSource(traceContent, dpuTableLength, suggestItems)
        tracesContent = processTextWithTraces(answers, tracesRes)
      }
      const formattedAnswers = processTextWithEntities(tracesContent, entity || [])
      bubbleList.push({
        id: `${questionsID}-${answers}`,
        message: {
          role: 'ai',
          rawSentence: questions,
          rawSentenceID: questionsID,
          content: formattedAnswers || ERROR_TEXT[questionStatus ?? 0],
          error: ERROR_TEXT[questionStatus ?? 0],
          reasonContent: think,
          questionStatus,
          entity: entity,
          gelData: data?.gelData,
          refBase: data?.result?.suggest?.items,
          refTable: data?.result?.content?.data,
          chartType: data?.result?.content?.chart,
          think: (think?.length ?? 0 > 0) ? 1 : undefined,
          status: 'finish',
          chatId: groupId,
        },
        status: 'success',
      })
    }
  })

  return bubbleList
}

export interface UseChatRestoreProps {
  chatId: string
  entityCode?: string
  shouldRestore?: boolean
  axiosChat: AxiosInstance
  pageSize?: number
}

export interface UseChatRestoreResult {
  messagesByChatRestore: MessageInfo<MessageRaw>[]
  /** 加载状态 - 包括初始加载和分页加载 */
  bubbleLoading: boolean
  // 手动触发恢复会话的方法
  restoreMessages: () => void
  // 加载更多历史消息的方法
  loadMoreMessages: () => void
  // 是否还有更多消息可以加载
  hasMore: boolean
}

export const useChatRestore = ({
  chatId,
  entityCode,
  shouldRestore = true,
  axiosChat,
  pageSize = 10,
}: UseChatRestoreProps): UseChatRestoreResult => {
  const [currentPage, setCurrentPage] = useState(1)
  const [allMessages, setAllMessages] = useState<ChatRestoreResponse[]>([])
  console.log('🚀 ~ allMessages:', allMessages)
  const [hasMore, setHasMore] = useState(false)

  // 使用 ref 来跟踪当前请求的页码，避免状态更新导致的重复执行
  const currentRequestPageRef = useRef(1)

  const fetchChatHistoryRequest = useCallback(createChatRequestWithAxios(axiosChat, 'selectChatAIRecord'), [axiosChat])

  const {
    run: fetchChatHistory,
    loading: bubbleLoading,
    data,
  } = useRequest(fetchChatHistoryRequest, {
    onError: console.error,
    manual: true,
  })

  // 手动触发恢复会话的方法
  const restoreMessages = useCallback(() => {
    if (chatId || entityCode) {
      setCurrentPage(1)
      setAllMessages([])
      setHasMore(false)
      currentRequestPageRef.current = 1
      fetchChatHistory({
        groupId: chatId,
        entityCode,
        pageSize,
        pageIndex: 1,
      } as any)
    }
  }, [chatId, entityCode, fetchChatHistory, pageSize])

  // 加载更多历史消息的方法
  const loadMoreMessages = useCallback(() => {
    if ((chatId || entityCode) && hasMore && !bubbleLoading) {
      const nextPage = currentPage + 1
      setCurrentPage(nextPage)
      currentRequestPageRef.current = nextPage
      fetchChatHistory({
        groupId: chatId,
        entityCode,
        pageSize,
        pageIndex: nextPage,
      } as any)

      // 注意：useRequest 的 run 方法不返回 Promise，所以不能使用 .then()
      // 数据变化会通过 useEffect 监听 data 变化来处理
    }
  }, [chatId, entityCode, hasMore, bubbleLoading, currentPage, fetchChatHistory, pageSize])

  // 监听 chatId 变化与恢复状态，加载历史消息
  useEffect(() => {
    if (!shouldRestore) {
      return
    }
    restoreMessages()
  }, [shouldRestore, restoreMessages])

  // 处理新数据
  useEffect(() => {
    if (data?.Data) {
      const newMessages = data.Data
      console.log('🚀 ~ useEffect ~ newMessages:', newMessages)

      // 使用 ref 中记录的页码来判断是第一页还是加载更多
      const requestPageIndex = currentRequestPageRef.current

      if (requestPageIndex === 1) {
        // 第一页，直接替换
        setAllMessages(newMessages)
      } else {
        // 加载更多，追加到前面
        setAllMessages((prev) => [...newMessages, ...prev])
      }

      // 判断是否还有更多数据
      setHasMore(pageSize * requestPageIndex < data.Page.Records)
    }
  }, [data, pageSize])

  const messagesByChatRestore = useMemo<MessageInfo<MessageRaw>[]>(() => {
    return transformChatRestoreToRawMessages(allMessages)
  }, [allMessages])

  return {
    messagesByChatRestore,
    bubbleLoading,
    restoreMessages,
    loadMoreMessages,
    hasMore,
  }
}
