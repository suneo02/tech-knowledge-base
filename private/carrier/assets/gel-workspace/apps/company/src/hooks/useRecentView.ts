import { useState, useCallback } from 'react'
import { message } from '@wind/wind-ui'
import { GroupBrowseHistoryItem } from '../api/paths/search'

export interface UseRecentViewOptions {
  onFetchRecentView: () => Promise<GroupBrowseHistoryItem[]>
  onAddRecentViewItem: (entityId: string, entityName: string) => Promise<void>
  onDeleteRecentViewItem: (entityId: string, parameter?: string) => Promise<void>
  onClearRecentView: () => Promise<void>
}

/**
 * 最近浏览Hook
 * @author 刘兴华<xhliu.liu@wind.com.cn>
 * @param options 配置选项
 * @returns 最近浏览相关状态和方法
 */
export const useRecentView = (options: UseRecentViewOptions) => {
  const { onFetchRecentView, onAddRecentViewItem, onDeleteRecentViewItem, onClearRecentView } = options

  const [recentViewList, setRecentViewList] = useState<GroupBrowseHistoryItem[]>([])
  const [loading, setLoading] = useState(false)

  /**
   * 获取最近浏览列表
   */
  const fetchRecentView = useCallback(async () => {
    try {
      setLoading(true)
      const result = await onFetchRecentView()
      // 限制最多展示5条数据
      const limitedResult = result.slice(0, 5)
      setRecentViewList(limitedResult)
      return limitedResult
    } catch (error) {
      console.error('获取最近浏览列表失败:', error)

      setRecentViewList([])
      return []
    } finally {
      setLoading(false)
    }
  }, [onFetchRecentView])

  /**
   * 添加最近浏览记录
   */
  const addRecentViewItem = useCallback(
    async (entityId: string, entityName: string) => {
      try {
        await onAddRecentViewItem(entityId, entityName)
        // 添加成功后刷新列表
        await fetchRecentView()
      } catch (error) {
        console.error('添加最近浏览记录失败:', error)
        message.error('添加最近浏览记录失败')
      }
    },
    [onAddRecentViewItem, fetchRecentView]
  )

  /**
   * 删除单个最近浏览记录
   */
  const deleteRecentViewItem = useCallback(
    async (item: GroupBrowseHistoryItem) => {
      try {
        await onDeleteRecentViewItem(item.entityId, item.parameter)
        // 删除成功后从本地状态中移除
        setRecentViewList((prev) => prev.filter((viewItem) => viewItem.entityId !== item.entityId))
        message.success('删除成功')
      } catch (error) {
        console.error('删除最近浏览记录失败:', error)
        message.error('删除失败')
      }
    },
    [onDeleteRecentViewItem]
  )

  /**
   * 清空所有最近浏览记录
   */
  const clearRecentView = useCallback(async () => {
    try {
      await onClearRecentView()
      // 清空成功后清空本地状态
      setRecentViewList([])
      message.success('清空成功')
    } catch (error) {
      console.error('清空最近浏览记录失败:', error)
      message.error('清空失败')
    }
  }, [onClearRecentView])

  return {
    recentViewList,
    loading,
    fetchRecentView,
    addRecentViewItem,
    deleteRecentViewItem,
    clearRecentView,
  }
}
