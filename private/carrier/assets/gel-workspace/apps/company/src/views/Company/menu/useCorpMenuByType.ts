import { createCorpDetailMenus } from '@/components/company/layoutConfig/menus'
import { CorpMenuCfg } from '@/types/corpDetail/menu.ts'
import { wftCommon } from '@/utils/utils'
import { CorpBasicInfo, CorpBasicNumFront } from 'gel-types'
import { useMemo } from 'react'

/**
 * 【第二层：缓存层】根据企业信息获取菜单配置 Hook
 *
 * ## 职责：缓存菜单配置，避免重复计算
 *
 * ### 功能：
 * 1. **缓存优化**：使用 useMemo 缓存 createCorpDetailMenus 的结果
 * 2. **错误处理**：捕获配置生成错误，返回默认配置
 * 3. **依赖追踪**：当 corpBasicInfo 或 basicNum 变化时重新生成配置
 *
 * ### 数据流：
 * ```
 * corpBasicInfo + basicNum
 *   ↓
 * createCorpDetailMenus (第一层过滤：企业类型/特殊模块)
 *   ↓
 * useMemo 缓存
 *   ↓
 * 返回 CorpMenuCfg (一级菜单模块配置)
 * ```
 *
 * ### 输出：
 * 返回 CorpMenuCfg 对象，包含应该显示的所有一级菜单模块
 * 此时还未过滤子菜单项，也未添加统计数字
 *
 * ### 下一层：
 * 输出的配置会传递给 useCorpMenuData Hook，进行第三层过滤（基于统计数据）
 *
 * @param corpBasicInfo 企业基本信息
 * @param basicNum 企业统计数据
 * @returns 菜单配置对象
 *
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const corpInfo = useSelector(state => state.company.baseInfo)
 *   const basicNum = useSelector(state => state.company.basicNum)
 *
 *   // 自动缓存，只在 corpInfo 或 basicNum 变化时重新计算
 *   const menus = useCorpMenuByType(corpInfo, basicNum)
 *
 *   return <MenuTree menus={menus} />
 * }
 * ```
 */
export const useCorpMenuByType = (
  corpBasicInfo: CorpBasicInfo | null | undefined,
  basicNum?: Partial<CorpBasicNumFront>
): CorpMenuCfg => {
  const menus = useMemo(() => {
    try {
      // 获取菜单配置（根据企业类型、地区、统计数据生成）
      return createCorpDetailMenus(corpBasicInfo, basicNum, wftCommon.is_overseas_config)
    } catch (error) {
      console.error('useCorpMenuByType: 菜单配置处理失败，返回默认菜单', error)
      // 如果出错，返回默认菜单配置
      return createCorpDetailMenus()
    }
  }, [corpBasicInfo, basicNum])

  return menus
}
