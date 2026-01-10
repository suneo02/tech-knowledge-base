import {
  getIfIPOCorpByBasicNum,
  getIfPrivateFundCorpByBasicNum,
  getIfPublicFundCorpByBasicNum,
} from '@/domain/corpDetail'
import { getCorpAreaByAreaCode } from '@/handle/corp/corpArea.ts'
import { getIfIndividualBusiness } from '@/handle/corp/corpType'
import { CorpMenuCfg } from '@/types/corpDetail/menu.ts'
import { CorpBasicInfo, CorpBasicNumFront } from 'gel-types'
import { corpDetailBusinessMenu } from './business'
import { corpDetailBusinessRiskMenu } from './businessRisk'
import { createFinanceMenu } from './finance'
import { corpDetailFinancialDataMenu } from './financialData'
import { corpDetailPrivateFundMenu, corpDetailPublicFundMenu } from './fund'
import { createHistoryMenuConfig } from './history'
import { corpDetailIntellectualMenu } from './intellectual'
import { corpDetailIpoMenu } from './ipo'
import { createOverviewMenu } from './overview'
import { corpDetailQualificationsMenu } from './qualifications'
import { corpDetailRiskMenu } from './risk'

/**
 * 【第一层过滤】创建企业详情菜单配置
 *
 * ## 职责：根据企业类型和特征，决定显示哪些一级菜单模块
 *
 * ### 过滤维度：
 * 1. **企业类型过滤**：
 *    - 个体工商户：移除"金融行为"、"资质荣誉"、"司法风险"、"经营风险"模块
 *    - 普通企业：保留所有基础模块
 *
 * 2. **特殊数据模块**（根据 basicNum 动态添加）：
 *    - IPO 数据：有上市公司数据时添加"业务数据"模块
 *    - 公募基金：有公募基金数据时添加"公募基金数据"模块
 *    - 私募基金：有私募基金数据时添加"私募基金数据"模块
 *
 * 3. **地区适配**：
 *    - 海外企业：调整菜单名称（如"工商信息" → "基本信息"）
 *    - 国内企业：使用标准名称
 *
 * 4. **用户类型过滤**：
 *    - 海外用户：移除"司法风险"、"经营风险"模块
 *    - 国内用户：保留所有模块
 *
 * ### 输出：
 * 返回 CorpMenuCfg 对象，包含应该显示的所有一级菜单模块配置
 * 每个模块包含 title 和 children（子菜单项配置）
 *
 * ### 下一层：
 * 输出的配置会传递给 useCorpMenuByType Hook，进行缓存和错误处理
 *
 * @param corpBasicInfo 企业基本信息（用于判断企业类型和地区）
 * @param basicNum 企业统计数据（用于判断是否显示特殊模块）
 * @param isOverseasUser 是否为海外用户（用于过滤司法风险和经营风险模块）
 * @returns 菜单配置对象
 *
 * @example
 * ```typescript
 * // 个体工商户
 * const menus = createCorpDetailMenus(
 *   { corp_type: '个体工商户', areaCode: '110000' },
 *   { ... },
 *   false
 * )
 * // 返回：{ overview, bussiness, intellectual, history }
 * // 不包含：financing, qualifications, risk, businessRisk
 *
 * // 上市公司
 * const menus = createCorpDetailMenus(
 *   { corp_type: '有限责任公司', areaCode: '110000' },
 *   { ipoNum: 10, ... },
 *   false
 * )
 * // 返回：{ overview, IpoBusinessData, financing, bussiness, ... }
 *
 * // 海外用户
 * const menus = createCorpDetailMenus(
 *   { corp_type: '有限责任公司', areaCode: '110000' },
 *   { ... },
 *   true
 * )
 * // 返回：{ overview, bussiness, intellectual, history }
 * // 不包含：risk, businessRisk
 * ```
 */
export function createCorpDetailMenus(
  corpBasicInfo?: CorpBasicInfo,
  basicNum?: Partial<CorpBasicNumFront>,
  isOverseasUser?: boolean
): CorpMenuCfg {
  const corpArea = getCorpAreaByAreaCode(corpBasicInfo?.areaCode)

  // 判断企业类型
  const isIndividualBusiness = corpBasicInfo
    ? getIfIndividualBusiness(corpBasicInfo.corp_type, corpBasicInfo.corp_type_id)
    : false

  // 根据 basicNum 判断是否显示基金和IPO菜单
  const showPrivateFund = basicNum ? getIfPrivateFundCorpByBasicNum(basicNum) : false
  const showPublicFund = basicNum ? getIfPublicFundCorpByBasicNum(basicNum) : false
  const showIPO = basicNum ? getIfIPOCorpByBasicNum(basicNum) : false

  // 基础菜单配置（保持原有顺序）
  const menus: CorpMenuCfg = {
    // 工商信息 / 基本信息（海外企业直接生成"基本信息"）
    overview: createOverviewMenu(corpBasicInfo, basicNum),
    // 业务数据（仅在有IPO数据时添加）
    ...(showIPO ? { IpoBusinessData: corpDetailIpoMenu } : {}),
    // 公募基金数据（仅在有公募基金数据时添加）
    ...(showPublicFund ? { PublishFundData: corpDetailPublicFundMenu } : {}),
    // 私募基金数据（仅在有私募基金数据时添加）
    ...(showPrivateFund ? { PrivateFundData: corpDetailPrivateFundMenu } : {}),
    // 金融行为（个体工商户不显示）
    ...(!isIndividualBusiness ? { financing: createFinanceMenu(basicNum) } : {}),
    financialData: corpDetailFinancialDataMenu,
    // 经营信息
    bussiness: corpDetailBusinessMenu,
    // 资质荣誉（个体工商户不显示）
    ...(!isIndividualBusiness ? { qualifications: corpDetailQualificationsMenu } : {}),
    // 知识产权
    intellectual: corpDetailIntellectualMenu,
    // 法律诉讼（个体工商户不显示，海外用户不显示）
    ...(!isIndividualBusiness && !isOverseasUser ? { risk: corpDetailRiskMenu } : {}),
    // 经营风险（个体工商户不显示，海外用户不显示）
    ...(!isIndividualBusiness && !isOverseasUser ? { businessRisk: corpDetailBusinessRiskMenu } : {}),
    // 历史数据（根据地区动态生成）
    history: createHistoryMenuConfig(corpArea),
  }

  return menus
}
