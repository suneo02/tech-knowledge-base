import { useCallback, useEffect, useState } from 'react'
import { message } from '@wind/wind-ui'

export interface UseSearchHistoryProps {
  onFetchHistory?: () => Promise<any[]>
  onAddHistoryItem?: (name: string, value?: string) => Promise<void>
  onClearHistory?: () => Promise<void>
  onDeleteHistoryItem?: (searchKey: string) => Promise<void>
}

export const useSearchHistory = ({
  onFetchHistory,
  onAddHistoryItem,
  onClearHistory,
  onDeleteHistoryItem,
}: UseSearchHistoryProps) => {
  const [historyList, setHistoryList] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const fetchHistory = useCallback(async () => {
    if (!onFetchHistory) return
    try {
      const list = await onFetchHistory()
      // 根据 value 字段进行去重
      const uniqueList =
        list?.filter((item, index, arr) => arr.findIndex((prevItem) => prevItem?.value === item?.value) === index) || []
      setHistoryList(uniqueList)
    } catch (error) {
      console.error('获取历史记录失败:', error)
      setHistoryList([])
    }
  }, [onFetchHistory])

  useEffect(() => {
    if (onFetchHistory) {
      fetchHistory()
    }
  }, [onFetchHistory, fetchHistory])

  const addHistoryItem = useCallback(
    async (name: string, value?: string) => {
      if (!onAddHistoryItem) return
      try {
        await onAddHistoryItem(name, value)
        // After adding, refresh the history list to show the new item.
        if (showHistory) {
          await fetchHistory()
        }
      } catch (error) {
        console.error('保存历史记录失败:', error)
      }
    },
    [onAddHistoryItem, showHistory, fetchHistory]
  )

  const clearHistory = useCallback(async () => {
    if (!onClearHistory) return
    try {
      await onClearHistory()
      setHistoryList([])
    } catch (error) {
      console.error('清空历史记录失败:', error)
    }
  }, [onClearHistory])

  const deleteHistoryItem = useCallback(
    async (item: any) => {
      if (!onDeleteHistoryItem) return
      try {
        // 使用 searchKey 作为删除的标识
        const searchKey = item.searchKey || item.value || item.name
        await onDeleteHistoryItem(searchKey)
        // 删除成功后从本地状态中移除
        setHistoryList((prev) =>
          prev.filter((historyItem) => {
            const itemKey = historyItem.searchKey || historyItem.value || historyItem.name
            return itemKey !== searchKey
          })
        )
        message.success('删除成功')
      } catch (error) {
        console.error('删除历史记录失败:', error)
        message.error('删除失败')
      }
    },
    [onDeleteHistoryItem]
  )

  return {
    historyList,
    showHistory,
    setShowHistory,
    fetchHistory,
    addHistoryItem,
    clearHistory,
    deleteHistoryItem,
  }
}
