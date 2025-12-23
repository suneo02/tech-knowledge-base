import { ICorpSubModuleCfg } from '@/components/company/type'

/**
 * 股权出质人
 */
export const corpDetailEquityPledgor: ICorpSubModuleCfg = {
  modelNum: 'equitypledgedCountbypledgor',
}

/**
 * 股权 质权人
 */
export const corpDetailEquityPledgePawnee: ICorpSubModuleCfg = {
  modelNum: 'equitypledgedCountbypledgee',
}

/**
 * 出质标的
 */
export const corpDetailEquityPledgePCorp: ICorpSubModuleCfg = {
  modelNum: 'equitypledgedCountbycomid',
}

/**
 * 股权出质
 */
export const corpDetailEquityPledge: ICorpSubModuleCfg = {
  modelNum: ['equitypledgedCountbypledgor', 'equitypledgedCountbypledgee', 'equitypledgedCountbycomid'],
}
