import { TCorpDetailModule, TCorpDetailSubModule } from 'gel-types'
import { CorpBasicNumFront } from './basicNum'

export type CorpMenuModuleCfg = {
  title: string
  children: {
    countKey: Array<keyof CorpBasicNumFront> | keyof CorpBasicNumFront | true
    showModule: TCorpDetailSubModule
    showName: string
    hideMenuNum?: boolean // 是否在菜单中隐藏统计数字（不影响内容区域）
  }[]
}

/**
 * 企业详情菜单配置
 */
export type CorpMenuCfg = Partial<Record<TCorpDetailModule, CorpMenuModuleCfg>>
