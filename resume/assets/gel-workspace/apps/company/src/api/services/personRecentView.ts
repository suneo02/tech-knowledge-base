import { request } from '../request'

/**
 * 人物最近浏览记录项
 */
export interface PersonBrowseHistoryItem {
  entityId: string
  entityName: string
}

/**
 * 获取人物最近浏览列表
 * @returns Promise<PersonBrowseHistoryItem[]>
 */
export const getPersonRecentViewList = async (): Promise<PersonBrowseHistoryItem[]> => {
  try {
    const response = await request('operation/get/personbrowsehistorylist', {
      noExtra: true,
    })

    if (response.Data && Array.isArray(response.Data)) {
      return response.Data
    }
    return []
  } catch (error) {
    console.error('获取人物最近浏览列表失败:', error)
    return []
  }
}

/**
 * 添加人物最近浏览记录
 * @param entityId 实体ID
 * @param entityName 实体名称
 * @returns Promise<void>
 */
export const addPersonRecentViewItem = async ({
  entityId,
  parameter,
}: {
  entityId: string
  parameter: string
}): Promise<void> => {
  try {
    await request('operation/insert/personbrowsehistoryadd', {
      params: {
        parameter,
        entityId,
      },
    })
  } catch (error) {
    console.error('添加人物最近浏览记录失败:', error)
    throw error
  }
}

/**
 * 删除单个人物最近浏览记录
 * @param entityId 实体ID
 * @returns Promise<void>
 */
export const deletePersonRecentViewItem = async (entityId: string, parameter: string): Promise<void> => {
  try {
    await request('operation/delete/personbrowsehistorydeleteone', {
      params: {
        entityId,
        parameter,
      },
    })
  } catch (error) {
    console.error('删除人物最近浏览记录失败:', error)
    throw error
  }
}

/**
 * 清空所有人物最近浏览记录
 * @returns Promise<void>
 */
export const clearAllPersonRecentView = async (): Promise<void> => {
  try {
    await request('operation/delete/personbrowsehistorydeleteall', {})
  } catch (error) {
    console.error('清空人物最近浏览记录失败:', error)
    throw error
  }
}
