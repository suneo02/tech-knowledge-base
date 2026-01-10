import { CorpSubModuleCfg } from '@/types/corpDetail'

export const corpDetailChattelMortgagor: CorpSubModuleCfg = {
  modelNum: 'chattelMortgagor',
}
export const corpDetailChattelMortgagee: CorpSubModuleCfg = {
  modelNum: 'chattelMortgagee',
}
export const corpDetailChattelMortgage: CorpSubModuleCfg = {
  modelNum: ['chattelMortgagor', 'chattelMortgagee'],
}
