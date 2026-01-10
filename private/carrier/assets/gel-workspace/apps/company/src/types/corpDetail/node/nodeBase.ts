import { CorpDetailNodeCfgCommon, CprpDetailNodeVipCfg } from './nodeCommon'
import { CorpTableCfg } from './table'
import { StatisticalChartType } from '@/components/company/type/statisticalChart'

/**
 * vip table 必须要传入这两个值
 */
export type CorpTableVipCfg = CorpTableCfg & CprpDetailNodeVipCfg

/**
 * 企业详情单个模块下多个组件的配置
 */
export interface CorpDetailModuleWithChildrenCfg
  extends Pick<CorpDetailNodeCfgCommon, 'title' | 'modelNum' | 'modelNumStr' | 'numHide'> {
  children: CorpTableCfg[]
  // 统计图表的类型
  statisticalChart: StatisticalChartType
  // 统计图表的 统计数字，和 model num 不同，比如 商标 专利 的统计数字是 本公司
  statisticalChartNum: CorpTableCfg['modelNum']
  withTab?: boolean
  showguaranteeNotMarket?: any
  rightLink?: any
}

export type CorpDetailModuleWithChildrenVipCfg = CorpDetailModuleWithChildrenCfg &
  CprpDetailNodeVipCfg & {
    children: CorpTableVipCfg[]
  }

/**
 * 企业详情单个模块的配置 可能是一个 table 也可能是 tabs
 */
export type CorpSubModuleCfgNonCustom = CorpDetailModuleWithChildrenCfg | CorpTableCfg

/**
 * 企业详情单个模块的配置 可能是一个 table 也可能是 tabs
 * vip
 */
export type CorpSubModuleCfgVipNonCustom = CorpDetailModuleWithChildrenVipCfg | CorpTableVipCfg
