import { ICorpTableCfg } from '@/components/company/type/corpDetail/ICorpTableCfg.ts'
import { TCorpDetailModuleValue, TCorpDetailSubModule } from '@/handle/corp/detail/module/type.ts'
import { ReactNode } from 'react'

/**
 * vip table 必须要传入这两个值
 */
export type ICorpTableVipCfg = ICorpTableCfg & {
  notVipTitle: string
  notVipTips: string
}

/**
 * 企业详情单个模块下多个组件的配置
 */
export type ICorpDetailModuleWithChildrenCfg = {
  title?: string
  modelNum: ICorpTableCfg['modelNum']
  modelNumStr?: ReactNode
  numHide?: boolean
  children: ICorpTableCfg[]
  titleTabs?: any
  // 统计图表的类型
  statisticalChart: 'brand' | 'patent'
  // 统计图表的 统计数字，和 model num 不同，比如 商标 专利 的统计数字是 本公司
  statisticalChartNum: ICorpTableCfg['modelNum']
  withTab?: boolean
  showguaranteeNotMarket?: any
  rightLink?: any
}

export type ICorpDetailModuleWithChildrenVipCfg = ICorpDetailModuleWithChildrenCfg & {
  children: ICorpTableVipCfg[]
  notVipTitle: string
  notVipTips: string
}

/**
 * 企业详情单个模块的配置 可能是一个 table 也可能是 tabs
 */
export type ICorpSubModuleCfgNonCustom = ICorpDetailModuleWithChildrenCfg | ICorpTableCfg

/**
 * 企业详情单个模块的配置 可能是一个 table 也可能是 tabs
 * vip
 */
export type ICorpSubModuleCfgVipNonCustom = ICorpDetailModuleWithChildrenVipCfg | ICorpTableVipCfg

export type ICorpSubModuleCfgCustom = {
  custom: true
} & ICorpSubModuleCfgNonCustom

export type ICorpSubModuleCfgVipCustom = {
  custom: true
} & ICorpSubModuleCfgVipNonCustom

export type ICorpModuleTitleCfg = {
  title: string
  moduleKey: TCorpDetailModuleValue
  noneData: string
}
export type ICorpSubModuleCfg = ICorpSubModuleCfgNonCustom | ICorpSubModuleCfgCustom

export type ICorpSubModuleVipCfg = ICorpSubModuleCfgVipNonCustom | ICorpSubModuleCfgVipCustom
/**
 * 企业详情大一级的模块配置
 */
export type ICorpPrimaryModuleCfg = Partial<
  Record<TCorpDetailSubModule, ICorpSubModuleCfg> & {
    moduleTitle: ICorpModuleTitleCfg
  }
>

export type ICorpPrimaryModuleVipCfg = Partial<
  Record<TCorpDetailSubModule, ICorpSubModuleVipCfg> & {
    moduleTitle: ICorpModuleTitleCfg
  }
>
