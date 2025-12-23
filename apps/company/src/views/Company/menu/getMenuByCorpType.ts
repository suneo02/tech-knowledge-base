import { getIfIndividualBusiness } from '@/handle/corp/corpType'
import { CorpBasicInfo } from 'gel-types'
import { getCorpDetailIndividualMenus } from './individualBusiness'
import { CompanyDetailBaseMenus } from './menus'
import { ICorpMenuCfg } from './type'

/**
 * 根据企业类型获取对应的菜单配置
 * @param corpTypeId 企业类型ID
 * @param corpType 企业类型
 * @param areaCode 地区代码
 * @returns 菜单配置对象
 *
 * @example
 * ```ts
 * const menus = getMenuByCorpType(res.Data.corp_type_id, res.data.corp_type, res.Data.areaCode)
 * // 应用到 CompanyDetailBaseMenus
 * for (const k in CompanyDetailBaseMenus) {
 *   delete CompanyDetailBaseMenus[k]
 * }
 * for (const k in menus) {
 *   CompanyDetailBaseMenus[k] = menus[k]
 * }
 * ```
 */
export const getMenuByCorpType = (
  corpTypeId?: CorpBasicInfo['corp_type_id'],
  corpType?: CorpBasicInfo['corp_type']
): ICorpMenuCfg => {
  // 如果没有企业类型信息，返回基础菜单
  if (!corpTypeId || !corpType) {
    return CompanyDetailBaseMenus
  }

  // 个体工商户
  if (getIfIndividualBusiness(corpType, corpTypeId)) {
    return getCorpDetailIndividualMenus()
  }

  // 特殊企业类型ID 或 海外企业 或 普通企业
  // 都返回基础菜单
  return CompanyDetailBaseMenus
}
