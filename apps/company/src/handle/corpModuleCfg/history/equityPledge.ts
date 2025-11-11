import { ICorpSubModuleCfg } from '@/components/company/type'

export const corpDetailHisEquityPledge: ICorpSubModuleCfg = {
  modelNum: ['hisEquitypledgedCountbypledgor', 'hisEquitypledgedCountbypledgee', 'hisEquitypledgedCountbycomid'],
}

/**
 * 股权出质人
 */
export const corpDetailHisEquityPledgor: ICorpSubModuleCfg = {
  modelNum: 'hisEquitypledgedCountbypledgor',
}

/**
 * 股权 质权人
 */
export const corpDetailHisEquityPledgePawnee: ICorpSubModuleCfg = {
  modelNum: 'hisEquitypledgedCountbypledgee',
}

/**
 * 出质标的
 */
export const corpDetailHisEquityPledgePCorp: ICorpSubModuleCfg = {
  modelNum: 'hisEquitypledgedCountbycomid',
}
