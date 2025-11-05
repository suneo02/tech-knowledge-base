import { ICorpSubModuleCfg, ICorpTableCfg } from '@/components/company/type'

export const corpDetailMainMember: ICorpSubModuleCfg = {
  modelNum: ['lastNotice', 'industrialRegist'],
}

export const corpDetailLastNotice: ICorpTableCfg = {
  modelNum: 'lastNotice',
}

export const corpDetailIndustrialRegist: ICorpTableCfg = {
  modelNum: 'industrialRegist',
}
