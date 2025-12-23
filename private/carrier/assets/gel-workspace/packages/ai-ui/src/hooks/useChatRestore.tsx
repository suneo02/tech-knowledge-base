import { CLASSNAME_USER_ROLE } from '@/ChatRoles'
import { MessageInfo } from '@ant-design/x/es/use-x-chat'
import { useRequest } from 'ahooks'
import { AxiosInstance } from 'axios'
import { ChatDetailTurn, createChatRequestWithAxios } from 'gel-api'
import { AgentMsgDepre, transformChatRestoreToRawMessages } from 'gel-ui'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

export interface UseChatRestoreProps {
  chatId: string
  entityCode?: string
  shouldRestore?: boolean
  axiosChat: AxiosInstance
  pageSize?: number
  // 滚动相关参数
  scrollToIndex?: number
}

export interface UseChatRestoreResult {
  messagesByChatRestore: MessageInfo<AgentMsgDepre>[]
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
  scrollToIndex,
}: UseChatRestoreProps): UseChatRestoreResult => {
  const [currentPage, setCurrentPage] = useState(1)
  const [allMessages, setAllMessages] = useState<ChatDetailTurn[]>([])
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
        pageSize: scrollToIndex && scrollToIndex > pageSize ? scrollToIndex : pageSize,
        pageIndex: 1,
      })
    }
  }, [chatId, entityCode, fetchChatHistory, pageSize, scrollToIndex])

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
      })

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
      setHasMore(pageSize * requestPageIndex < (data?.Page?.Records || 0))
    }
  }, [data, pageSize])

  // 滚动到指定 user-role 元素
  const scrollToUserRoleByIndex = useCallback((index: number) => {
    // 使用 requestAnimationFrame 确保在下一帧渲染后执行
    requestAnimationFrame(() => {
      const userRoleElements = document.querySelectorAll(`.${CLASSNAME_USER_ROLE}`)
      if (userRoleElements.length >= index) {
        const targetElement = userRoleElements[userRoleElements.length - index] as HTMLElement
        if (targetElement?.scrollIntoView) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    })
  }, [])

  // 会话还原完成且消息已加载 且是第一页 且有滚动索引，触发滚动回调
  useEffect(() => {
    if (typeof scrollToIndex === 'number' && !bubbleLoading && allMessages.length > 0 && currentPage === 1) {
      scrollToUserRoleByIndex(scrollToIndex)
    }
  }, [scrollToIndex, bubbleLoading, allMessages.length, scrollToUserRoleByIndex, currentPage])

  const messagesByChatRestore = useMemo<MessageInfo<AgentMsgDepre>[]>(() => {
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
