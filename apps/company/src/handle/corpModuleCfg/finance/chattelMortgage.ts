import { ICorpSubModuleCfg } from '@/components/company/type'

export const corpDetailChattelMortgagor: ICorpSubModuleCfg = {
  modelNum: 'chattelMortgagor',
}
export const corpDetailChattelMortgagee: ICorpSubModuleCfg = {
  modelNum: 'chattelMortgagee',
}
export const corpDetailChattelMortgage: ICorpSubModuleCfg = {
  modelNum: ['chattelMortgagor', 'chattelMortgagee'],
}
