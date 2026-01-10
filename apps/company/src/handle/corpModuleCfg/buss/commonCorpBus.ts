import { CorpSubModuleCfg } from '@/types/corpDetail'

export const corpDetailCommonCorpBus: CorpSubModuleCfg = {
  modelNum: ['project_info_num', 'tradelbl_num', 'brand_combining_num', 'ecommerce_store_num'],
}

export const corpDetailCorpBusProject: CorpSubModuleCfg = {
  modelNum: 'project_info_num',
}

export const corpDetailCorpBusBrand: CorpSubModuleCfg = {
  modelNum: 'tradelbl_num',
}

export const corpDetailCorpBusBrandJoin: CorpSubModuleCfg = {
  modelNum: 'brand_combining_num',
}

export const corpDetailCorpBusECommerce: CorpSubModuleCfg = {
  modelNum: 'ecommerce_store_num',
}
