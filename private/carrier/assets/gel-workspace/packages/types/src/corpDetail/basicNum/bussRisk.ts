/**
 * 企业详情 经营风险 统计数字
 */

export interface CorpBasicNumBussRisk {
  violationPunish: number // 诚信信息
  manageabnormalCount: number // 经营异常
  cancelrecord_num: number // 注销备案
  liquidation_num: number // 清算信息
  taxdebtsCount: number // 欠税信息
  taxillegalCount: number // 税收违法
  illegal_num: number // 严重违法
  defaultonnonstandardassetsNum: number // 非标违约
  inspection_num: number // 抽查检查
  spot_check_num: number // 双随机抽查
  prodrecall_num: number // 产品召回
  guaranteedetailCount: number // 担保信息

  stock_pledgers_num: number // 股票质押-出质人
  stock_pledgees_num: number // 股票质押-质权人
  stock_plexes_num: number // 股票质押-出质标的

  equitypledgedCountbypledgor: number // 股权出质-出质人
  equitypledgedCountbypledgee: number // 股权出质-质权人
  equitypledgedCountbycomid: number // 股权出质-出质标的

  default_num: number // 债券违约

  intellectual_pledgeds_num: number // 知识产权出质
  ipPledgeCount: number // TODO 待确认

  debtOverdueCount: number //债务逾期数量
  commercialBillOverdueCount: number //商票逾期数量
  environmentalRatingCount: number //环保信用-环保评级数量
  keyMonitoringCompanyCount: number //环保信用-重点监控企业数量
  companyEquityPledgedCount: number //股权质押-本公司股权被质押数量
  heldEquityPledgedCount: number //股权质押-持有股权质押数量
  pledgeeCount: number //股权质押-质权方数量
  simpleCancellationCount: number //简易注销数量
}
