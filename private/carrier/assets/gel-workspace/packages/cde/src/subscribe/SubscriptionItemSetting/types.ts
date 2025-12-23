import { TRequestToWFCSpacfic } from 'gel-api'

/**
 * 订阅表单数据接口
 */
export interface SubscriptionFormData {
  subscriptionName: string
  isPushEnabled: boolean
  isEmailEnabled: boolean
  emailAddress: string
}

/**
 * 订阅表单配置接口
 */
export interface SubscriptionFormConfig {
  isEmailEditable: boolean
  defaultEmail?: string
}

/**
 * 订阅响应接口
 */
export interface SubscribeResponse {
  code: string
  ErrorMessage?: string
}

/**
 * 订阅表单状态接口
 * @interface SubscriptionFormState
 * @property {number} pushNotificationValue - 推送通知单选按钮的值（1: 启用, 0: 禁用）
 * @property {boolean} isPushNotificationEnabled - 是否开启推送通知的状态
 * @property {boolean} isEmailNotificationEnabled - 是否开启邮件通知的状态
 * @property {boolean} isEmailEditable - 控制邮箱输入框是否可编辑的状态
 * @property {string} emailAddress - 邮箱地址状态
 * @property {boolean} originalEmailNotificationEnabled - 保存原始邮件通知设置，用于取消时恢复
 * @property {string} originalEmailAddress - 保存原始邮箱地址，用于取消时恢复
 * @property {string} subscriptionName - 订阅名称状态
 */
export interface SubscriptionFormState {
  pushNotificationValue: number
  isPushNotificationEnabled: boolean
  isEmailNotificationEnabled: boolean
  isEmailEditable: boolean
  emailAddress: string
  originalEmailNotificationEnabled: boolean
  originalEmailAddress: string
  subscriptionName: string
}

export type SubscriptionFormApi = {
  updateSubFunc: TRequestToWFCSpacfic<'operation/update/updatesubcorpcriterion'>
  addSubFunc: TRequestToWFCSpacfic<'operation/insert/addsubcorpcriterion'>
}
