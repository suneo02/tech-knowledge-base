export interface GetUserFirstInAppResponse {
  init: boolean
}

export interface GetMyCustomerListData {
  id: string
  name: string
  createDate: string
  status: string // 1: 挖掘中, 2: 挖掘完成
  subscribed: boolean // 是否已订阅
  type: string // company: 企业, product: 产品, supplier: 供应商
}

export interface GetMyCustomerListResponse {
  data: GetMyCustomerListData[]
}

// ---------------- 公司名录页 专用模拟接口 ----------------
export interface GetCompanyDirectoryColumnsResponse {
  columns: Array<{ title: string; dataIndex: string; sorter?: boolean }>
}

export interface GetCompanyDirectoryDataResponse {
  data: Array<Record<string, unknown>>
}

import { MOCK_COLUMNS, MOCK_DATA } from '@/mock/constant'

/**
 * 获取用户是否第一次进入该应用
 */
export const getUserFirstInApp = (): Promise<GetUserFirstInAppResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ init: true })
    }, 1000)
  })
}

/**
 * 获取我的客户名单
 */
export const getMyCustomerList = (): Promise<GetMyCustomerListResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ data: [] })
    }, 1000)
  })
}

/**
 * 获取公司名录页表格列
 */
export const getCompanyDirectoryColumns = (): Promise<GetCompanyDirectoryColumnsResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({ columns: MOCK_COLUMNS })
    }, 300)
  })
}

/**
 * 获取公司名录页数据
 */
export const getCompanyDirectoryData = (selectedId?: number): Promise<GetCompanyDirectoryDataResponse> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (!selectedId) {
        resolve({ data: Array.isArray(MOCK_DATA) ? (MOCK_DATA as Array<Record<string, unknown>>) : [] })
        return
      }
      const mapped = (Array.isArray(MOCK_DATA) ? (MOCK_DATA as Array<Record<string, unknown>>) : []).map(
        (row, idx) => ({
          ...row,
          name: `${row.name as string}#${selectedId}-${idx + 1}`,
        })
      )
      resolve({ data: mapped })
    }, 500)
  })
}
