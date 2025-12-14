import { QueryFilter } from '@/windSecure'
import { BaseTableRequest } from '../../shared/types'

/**
 * 订阅列表项
 */
export interface SubscriptionListItem {
  cdeFilter: QueryFilter[] // 实际CDE筛选条件，用来回调
  newCompanyCount: number // 新增公司数量
  displayCdeFilter: QueryFilter[] // 展示用的CDE筛选条件
}

/**
 * 获取订阅列表 - 请求
 */
export interface GetSubscriptionListRequest extends BaseTableRequest {
  dynamic?: boolean
}

/**
 * 获取订阅列表 - 响应
 */
export interface GetSubscriptionListResponse {
  lastQueryTime: string // 上次查询时间
  list: SubscriptionListItem[]
  mail: string
  subPush: boolean // 是否订阅
  tableName: string
  totalNewCompany: number // 新增公司数量
}

/**
 * 更新订阅设置 - 请求
 */
export interface UpdateSubscriptionRequest extends BaseTableRequest {
  subPush: boolean
  mail: string
}

/**
 * 更新订阅设置 - 响应
 */
export interface UpdateSubscriptionResponse {
  data: boolean
}

/**
 * 获取CDE新增公司数量 - 请求
 */
export type GetCDENewCompanyRequest = BaseTableRequest

/**
 * 获取CDE新增公司数量 - 响应
 */
export interface GetCDENewCompanyResponse {
  disableToast: boolean // 判断当天是否还需要弹窗通知
  totalNewCompany: number // 新增公司数量
  subPush: boolean // 是否订阅
}

/**
 * 禁用CDE新增公司通知 - 请求
 */
export type DisableCDENewCompanyNoticeRequest = BaseTableRequest

/**
 * 禁用CDE新增公司通知 - 响应
 */
export interface DisableCDENewCompanyNoticeResponse {
  data: boolean
}
