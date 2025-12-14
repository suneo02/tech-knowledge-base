import { request } from '../request'
import { GroupBrowseHistoryItem } from '../paths/search'

/**
 * 获取最近浏览列表
 * @returns Promise<GroupBrowseHistoryItem[]>
 */
export const getGroupRecentViewList = async (): Promise<GroupBrowseHistoryItem[]> => {
  try {
    const response = await request('operation/get/groupbrowsehistorylist', {
      noExtra: true,
    })

    if (response.Data && Array.isArray(response.Data)) {
      return response.Data
    }
    return []
  } catch (error) {
    console.error('获取最近浏览列表失败:', error)
    return []
  }
}

/**
 * 添加集团系最近浏览记录
 * @param entityId 实体ID
 * @param entityName 实体名称
 * @returns Promise<void>
 */
export const addGroupRecentViewItem = async (entityId: string, entityName: string): Promise<void> => {
  try {
    await request('operation/insert/groupbrowsehistoryadd', {
      params: {
        entityId,
        entityName,
      },
      noExtra: true,
    })
  } catch (error) {
    console.error('添加最近浏览记录失败:', error)
    throw error
  }
}

/**
 * 删除单个最近浏览记录
 * @param entityId 实体ID
 * @returns Promise<void>
 */
export const deleteGroupRecentViewItem = async (entityId: string): Promise<void> => {
  try {
    await request('operation/delete/groupbrowsehistorydeleteone', {
      params: {
        entityId,
      },
      noExtra: true,
    })
  } catch (error) {
    console.error('删除最近浏览记录失败:', error)
    throw error
  }
}

/**
 * 清空所有最近浏览记录
 * @returns Promise<void>
 */
export const clearAllGroupRecentView = async (): Promise<void> => {
  try {
    await request('operation/delete/groupbrowsehistorydeleteall', {
      noExtra: true,
    })
  } catch (error) {
    console.error('清空最近浏览记录失败:', error)
    throw error
  }
}
