/**
 * 多标签页模块ID列表
 *
 * @description 用于标识需要特殊处理的多标签页模块，这些模块在无数据时仍需要显示空表格
 * @author 张文浩<suneo@wind.com.cn>
 */
export const multiTabIds = [
  'showIpoYield',
  'showIpoSales',
  'showIpoBusiness',
  'showIpoStock',
  'showFundSize',
  'showPrivateFundInfo',
  'getShareAndInvest',
  'getrelation',
  'showPledgedstock',
  'showStockMortgage',
  'showChattelmortgage',
  'historyshowPledgedstock',
  'historyshowChattelmortgage',
  'getbrand',
  'getpatent',
  'biddingInfo',
  'tiddingInfo',
  'gettechscore',
] as const

/**
 * 多标签页模块ID类型
 */
export type MultiTabId = (typeof multiTabIds)[number]
