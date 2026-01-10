import { CompanybrowsehistorylistResult } from 'gel-api'
import { request } from '../request'

/**
 * 企业最近浏览记录项
 */
export type CompanyBrowseHistoryItem = CompanybrowsehistorylistResult

/**
 * 获取企业最近浏览列表
 * @returns Promise<CompanyBrowseHistoryItem[]>
 */
export const getCompanyRecentViewList = async (): Promise<CompanyBrowseHistoryItem[]> => {
  try {
    const response = await request('operation/get/companybrowsehistorylist', {
      params: { pageSize: 5 },
      noExtra: true,
    })

    if (response.Data && Array.isArray(response.Data)) {
      return response.Data
    }
    return []
  } catch (error) {
    console.error('获取企业最近浏览列表失败:', error)
    return []
  }
}

/**
 * 添加企业最近浏览记录
 * @param entityId 实体ID
 * @returns Promise<void>
 */
export const addCompanyRecentViewItem = async (entityId: string): Promise<void> => {
  try {
    await request('operation/insert/companybrowsehistoryadd', {
      params: { entityId },
      noExtra: true,
    })
  } catch (error) {
    console.error('添加企业最近浏览记录失败:', error)
    throw error
  }
}

/**
 * 删除单个企业最近浏览记录
 * @param entityId 实体ID
 * @returns Promise<void>
 */
export const deleteCompanyRecentViewItem = async (entityId: string): Promise<void> => {
  try {
    await request('operation/delete/companybrowsehistorydeleteone', {
      params: { entityId },
      noExtra: true,
    })
  } catch (error) {
    console.error('删除企业最近浏览记录失败:', error)
    throw error
  }
}

/**
 * 清空所有企业最近浏览记录
 * @returns Promise<void>
 */
export const clearAllCompanyRecentView = async (): Promise<void> => {
  try {
    await request('operation/delete/companybrowsehistorydeleteall', {
      noExtra: true,
    })
  } catch (error) {
    console.error('清空企业最近浏览记录失败:', error)
    throw error
  }
}
