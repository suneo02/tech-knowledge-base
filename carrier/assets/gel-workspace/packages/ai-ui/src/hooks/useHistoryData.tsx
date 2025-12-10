import { message } from '@wind/wind-ui'
import { AxiosInstance } from 'axios'
import { AIChatHistory, requestToChatWithAxios } from 'gel-api'
import { t } from 'gel-util/intl'
import { useCallback, useEffect, useRef, useState } from 'react'

// 国际化词条
const intlMsg = {
  'fetch-history-failed': t('', '获取历史对话失败'),
  'delete-success': t('', '删除成功'),
  'delete-failed': t('', '删除失败'),
  'batch-delete-success': t('', '批量删除成功'),
  'batch-delete-failed': t('', '批量删除失败'),
} as const

export interface UseHistoryDataProps {
  axiosInstance: AxiosInstance
  pageSize?: number
  shouldFetch?: boolean
}

export interface UseHistoryDataResult {
  historyItems: AIChatHistory[]
  loading: boolean
  loadingMore: boolean
  hasMore: boolean
  currentPage: number
  searchKeyword: string
  setSearchKeyword: (keyword: string) => void
  refreshHistory: () => Promise<boolean>
  loadMore: () => Promise<boolean>
  removeHistory: (groupId: string) => Promise<boolean>
  removeHistories: (groupIds: string[]) => Promise<boolean>
}

export const useHistoryData = ({
  axiosInstance,
  pageSize = 10,
  shouldFetch = true,
}: UseHistoryDataProps): UseHistoryDataResult => {
  const [historyItems, setHistoryItems] = useState<AIChatHistory[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [searchKeyword, setSearchKeyword] = useState('')

  // 使用 ref 来跟踪当前请求的页码，避免状态更新导致的重复执行
  const currentRequestPageRef = useRef(1)

  // 获取历史对话列表
  const fetchHistory = useCallback(
    async (page: number, isLoadMore: boolean = false): Promise<boolean> => {
      try {
        if (isLoadMore) {
          setLoadingMore(true)
        } else {
          setLoading(true)
        }

        const requestParams: {
          pageSize: number
          pageIndex: number
          queryText?: string
          queryFlag?: boolean
        } = {
          pageSize: pageSize,
          pageIndex: page,
          queryText: '',
          queryFlag: true,
        }

        // 如果有搜索关键词，添加 queryText 参数
        if (searchKeyword.trim()) {
          requestParams.queryText = searchKeyword.trim()
        }

        const response = await requestToChatWithAxios(axiosInstance, 'selectChatAIConversation', requestParams)

        if (response && Array.isArray(response.Data)) {
          const newItems = response.Data
          if (isLoadMore) {
            // 加载更多时，追加数据
            setHistoryItems((prev) => [...prev, ...newItems])
          } else {
            // 首次加载或刷新时，替换数据
            setHistoryItems(newItems)
          }

          // 判断是否还有更多数据
          setHasMore(newItems.length === pageSize)

          return true
        } else {
          if (isLoadMore) {
            setHistoryItems((prev) => prev)
          } else {
            setHistoryItems([])
          }
          setHasMore(false)
          return false
        }
      } catch (error) {
        console.error('Failed to fetch history:', error)
        message.error(intlMsg['fetch-history-failed'])
        return false
      } finally {
        if (isLoadMore) {
          setLoadingMore(false)
        } else {
          setLoading(false)
        }
      }
    },
    [axiosInstance, searchKeyword, pageSize]
  )

  // 刷新历史对话
  const refreshHistory = useCallback(async (): Promise<boolean> => {
    setCurrentPage(1)
    setHasMore(true)
    currentRequestPageRef.current = 1
    return await fetchHistory(1, false)
  }, [fetchHistory])

  // 加载更多数据
  const loadMore = useCallback(async (): Promise<boolean> => {
    if (!hasMore || loadingMore) return false

    const nextPage = currentPage + 1
    currentRequestPageRef.current = nextPage
    const success = await fetchHistory(nextPage, true)

    if (success) {
      setCurrentPage(nextPage)
    }

    return success
  }, [hasMore, loadingMore, currentPage, fetchHistory])

  // 删除单个历史对话
  const removeHistory = useCallback(
    async (groupId: string): Promise<boolean> => {
      try {
        const response = await requestToChatWithAxios(axiosInstance, 'delChatGroup', {
          groupIds: [groupId],
        })

        if (response && response.Data) {
          // 从本地状态中移除
          setHistoryItems((prev) => prev.filter((item) => item.groupId !== groupId))
          message.success(intlMsg['delete-success'])
          return true
        } else {
          message.error(intlMsg['delete-failed'])
          return false
        }
      } catch (error) {
        console.error('Failed to delete history:', error)
        message.error(intlMsg['delete-failed'])
        return false
      }
    },
    [axiosInstance]
  )

  // 批量删除历史对话
  const removeHistories = useCallback(
    async (groupIds: string[]): Promise<boolean> => {
      try {
        const response = await requestToChatWithAxios(axiosInstance, 'delChatGroup', {
          groupIds,
        })

        if (response && response.Data) {
          // 从本地状态中移除
          setHistoryItems((prev) => prev.filter((item) => !groupIds.includes(item.groupId)))
          message.success(intlMsg['batch-delete-success'])
          return true
        } else {
          message.error(intlMsg['batch-delete-failed'])
          return false
        }
      } catch (error) {
        console.error('Failed to delete histories:', error)
        message.error(intlMsg['batch-delete-failed'])
        return false
      }
    },
    [axiosInstance]
  )

  // 当 shouldFetch 为 true 且 searchKeyword 变化时，重新加载数据
  useEffect(() => {
    if (shouldFetch) {
      refreshHistory()
    }
  }, [shouldFetch, searchKeyword, refreshHistory])

  return {
    historyItems,
    loading,
    loadingMore,
    hasMore,
    currentPage,
    searchKeyword,
    setSearchKeyword,
    refreshHistory,
    loadMore,
    removeHistory,
    removeHistories,
  }
}
