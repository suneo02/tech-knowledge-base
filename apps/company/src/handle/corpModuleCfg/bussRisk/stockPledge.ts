import { ICorpSubModuleCfg } from '@/components/company/type'

/**
 * 出质人
 */
export const corpDetailStockPledgor: ICorpSubModuleCfg = {
  modelNum: 'stock_pledgers_num',
}

/**
 * 质权人
 */
export const corpDetailStockPledgePawnee: ICorpSubModuleCfg = {
  modelNum: 'stock_pledgees_num',
}

/**
 * 出质标的
 */
export const corpDetailStockPledgePCorp: ICorpSubModuleCfg = {
  modelNum: 'stock_plexes_num',
}

/**
 * 股票质押
 */
export const corpDetailStockPledge: ICorpSubModuleCfg = {
  modelNum: ['stock_pledgers_num', 'stock_pledgees_num', 'stock_plexes_num'],
}
