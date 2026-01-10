import { CorpSubModuleCfg } from '@/types/corpDetail'

export const corpDetailHisEquityPledge: CorpSubModuleCfg = {
  modelNum: ['hisEquitypledgedCountbypledgor', 'hisEquitypledgedCountbypledgee', 'hisEquitypledgedCountbycomid'],
}

/**
 * 股权出质人
 */
export const corpDetailHisEquityPledgor: CorpSubModuleCfg = {
  modelNum: 'hisEquitypledgedCountbypledgor',
}

/**
 * 股权 质权人
 */
export const corpDetailHisEquityPledgePawnee: CorpSubModuleCfg = {
  modelNum: 'hisEquitypledgedCountbypledgee',
}

/**
 * 出质标的
 */
export const corpDetailHisEquityPledgePCorp: CorpSubModuleCfg = {
  modelNum: 'hisEquitypledgedCountbycomid',
}
