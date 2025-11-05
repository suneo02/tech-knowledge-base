import { useCallback, useEffect, useState } from 'react'

export interface UseSearchHistoryProps {
  onFetchHistory?: () => Promise<any[]>
  onAddHistoryItem?: (name: string, value?: string) => Promise<void>
  onClearHistory?: () => Promise<void>
}

export const useSearchHistory = ({ onFetchHistory, onAddHistoryItem, onClearHistory }: UseSearchHistoryProps) => {
  const [historyList, setHistoryList] = useState<any[]>([])
  const [showHistory, setShowHistory] = useState(false)

  const fetchHistory = useCallback(async () => {
    if (!onFetchHistory) return
    try {
      const list = await onFetchHistory()
      setHistoryList(list || [])
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

  return {
    historyList,
    showHistory,
    setShowHistory,
    fetchHistory,
    addHistoryItem,
    clearHistory,
  }
}
