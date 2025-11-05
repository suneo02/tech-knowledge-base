import { createPayOrder } from '@/api/pay.ts'
import { THKModuleType } from '@/api/corp/info/otherInfo.ts'
import { myWfcAjax } from '@/api/common.ts'

export interface IHKSearcherInfo {
  userName?: string // 用户名称
  identityCard?: string // 身份证号
  email?: string // 邮箱
  phone?: string // 电话
  needRecord: boolean // 是否需要记录查册人信息
  declarationOptions: number[] // 声明
}

// 前 4 项在 api 中是可选的，因为有回填
export type IHKOrderInfo = {
  companyCode: string // 公司编号
  dataModule: THKModuleType // 数据模块
} & IHKSearcherInfo

/**
 * 发起支付
 */
export const createHKPayOrder = async (payload: IHKOrderInfo) => {
  // 发起支付接口请求
  return await createPayOrder<IHKSearcherInfo>({
    goodsId: 51579,
    count: 1, // 购买数量
    extraParmaJson: payload,
  })
}

/**
 * 用户信息回填接口响应类型
 */
export type UserBackFilingInfo = Pick<IHKSearcherInfo, 'userName' | 'identityCard' | 'email' | 'phone'>

/**
 * 获取用户信息回填
 */
export const getUserInfoBackFilling = () => {
  return myWfcAjax<UserBackFilingInfo>(`operation/get/userInfoBackFilling`)
}
