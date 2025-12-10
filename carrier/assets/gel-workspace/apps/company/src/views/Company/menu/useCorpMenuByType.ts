import { getIfPrivateFundCorpByBasicNum, getIfPublicFundCorpByBasicNum } from '@/handle/corp/basicNum/fund'
import { ICorpBasicNumFront } from '@/handle/corp/basicNum/type'
import { CorpBasicInfo } from 'gel-types'
import { cloneDeep } from 'lodash'
import { useMemo } from 'react'
import { getIfIPOCorpByBasicNum } from '../handle/corpBasicNum'
import { getMenuByCorpType } from './getMenuByCorpType'
import { CompanyDetailBaseMenus } from './menus'
import { ICorpMenuCfg } from './type'

/**
 * 根据企业基本信息和统计数据获取对应的菜单配置 Hook
 *
 * 功能说明：
 * 1. 根据企业类型（个体工商户、政府机构等）获取对应的基础菜单配置
 * 2. 根据企业统计数据动态显示特殊菜单项（基金数据、IPO数据等）
 * 3. 根据企业地区特殊处理菜单名称（海外企业等）
 *
 * @param corpBasicInfo 企业基本信息
 * @param basicNum 企业统计数据（用于判断基金/IPO等特殊类型）
 * @param corpArea 企业所属地区（用于地区特殊处理，如海外企业）
 * @returns 菜单配置对象（如果没有企业信息，返回基础菜单）
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const [corpInfo, setCorpInfo] = useState<CorpBasicInfo | null>(null)
 *   const [basicNum, setBasicNum] = useState<ICorpBasicNumFront>({})
 *   const [corpArea, setCorpArea] = useState<TCorpArea>('')
 *   const menus = useCorpMenuByType(corpInfo, basicNum, corpArea)
 *
 *   return <div>...</div>
 * }
 * ```
 */
export const useCorpMenuByType = (
  corpBasicInfo: CorpBasicInfo | null | undefined,
  basicNum?: ICorpBasicNumFront,
  corpArea?: string
): ICorpMenuCfg => {
  const menus = useMemo(() => {
    try {
      // 获取基础菜单配置
      const baseMenus = getMenuByCorpType(corpBasicInfo?.corp_type_id, corpBasicInfo?.corp_type)

      // 如果没有 basicNum 或为空对象，直接返回基础菜单
      if (!basicNum || Object.keys(basicNum).length === 0) {
        return baseMenus
      }

      // 深拷贝菜单配置，避免修改原始对象
      const menusClone = cloneDeep(baseMenus)

      // 处理基金和IPO特殊菜单项
      if (getIfPrivateFundCorpByBasicNum(basicNum) && menusClone.PrivateFundData) {
        menusClone.PrivateFundData.hide = false
      }

      if (getIfPublicFundCorpByBasicNum(basicNum) && menusClone.PublishFundData) {
        menusClone.PublishFundData.hide = false
      }

      if (getIfIPOCorpByBasicNum(basicNum) && menusClone.IpoBusinessData) {
        menusClone.IpoBusinessData.hide = false
      }

      // 处理海外企业：将"工商信息"改为"基本信息"
      if (corpArea && menusClone.overview) {
        menusClone.overview.showName[0] = '基本信息'
      }

      return menusClone
    } catch (error) {
      console.error('useCorpMenuByType: 菜单配置处理失败，返回基础菜单', error)
      return CompanyDetailBaseMenus
    }
  }, [corpBasicInfo?.corp_type_id, corpBasicInfo?.corp_type, basicNum, corpArea])

  return menus
}
