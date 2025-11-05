import { ICorpSubModuleCfg } from '@/components/company/type'

export const corpDetailCommonCorpBus: ICorpSubModuleCfg = {
  modelNum: ['project_info_num', 'tradelbl_num', 'brand_combining_num', 'ecommerce_store_num'],
}

export const corpDetailCorpBusProject: ICorpSubModuleCfg = {
  modelNum: 'project_info_num',
}

export const corpDetailCorpBusBrand: ICorpSubModuleCfg = {
  modelNum: 'tradelbl_num',
}

export const corpDetailCorpBusBrandJoin: ICorpSubModuleCfg = {
  modelNum: 'brand_combining_num',
}

export const corpDetailCorpBusECommerce: ICorpSubModuleCfg = {
  modelNum: 'ecommerce_store_num',
}
