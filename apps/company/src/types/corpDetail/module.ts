import { TCorpDetailModule, TCorpDetailSubModule } from 'gel-types'
import { CorpSubModuleCfgCustom, CorpSubModuleCfgVipCustom } from './node/custom'
import { CorpSubModuleCfgNonCustom, CorpSubModuleCfgVipNonCustom } from './node/nodeBase'

export type CorpModuleTitleCfg = {
  title: string
  moduleKey: TCorpDetailModule
  noneData: string
}
export type CorpSubModuleCfg = CorpSubModuleCfgNonCustom | CorpSubModuleCfgCustom

export type CorpSubModuleVipCfg = CorpSubModuleCfgVipNonCustom | CorpSubModuleCfgVipCustom
/**
 * 企业详情大一级的模块配置
 */
export type CorpPrimaryModuleCfg = Partial<
  Record<TCorpDetailSubModule, CorpSubModuleCfg> & {
    moduleTitle: CorpModuleTitleCfg
  }
>

export type CorpPrimaryModuleVipCfg = Partial<
  Record<TCorpDetailSubModule, CorpSubModuleVipCfg> & {
    moduleTitle: CorpModuleTitleCfg
  }
>
