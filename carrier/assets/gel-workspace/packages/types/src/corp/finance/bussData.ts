export interface BalanceSheetData {
  _reportDate: string
  _sumOfAsset: number
  _sumOfDebt: number
  _sumOfHolderRightsAndInterests1: number
  _sumOfHolderRightsAndInterests2: number
  companyCode: string
}

export interface ProfitData {
  _businessProfit: number
  _netProfit2: number
  _reportDate: string
  _sumBusinessIncome: number
  _sumProfit: number
  companyCode: string
}

export interface CashFlowData {
  _netCashOfInvestment: number
  _netNumberForChippingCapital: number
  _netNumberOfBusinessCashPayout2: number
  _reportDate: string
  _sumForChippingCapital: number
  _sumOfBusinessCash: number
  _sumOfBusinessCashPayout: number
  _sumOfChipingCapital: number
  _sumOfInvestmentCashOut: number
  _sumOfOtherBusinessCashIn: number
  companyCode: string
}

export interface FinancialIndicatorData {
  // 资产负债率
  assentDebtRate?: number
  // 流动比率
  floatingProporting?: number
  // 销售毛利率 / 毛利率
  rawProfitOfSaling?: number
  // 报告期
  reportDate: string
  // 净利润增长率
  singQuarterNetProfitGrowth?: number
  // 速动比率
  speedProportiong?: number
  // 总资产回报率
  yearNetAssetGuerdonRate?: number
  // 净资产收益率
  yearNetAssetProfitRate?: number
  // 经营利润率
  manageProfitDivideTaking?: number
  // 净利润率
  saleNetProfit?: number
  // 投入资本回报率
  yearOfInvestAssetIncome?: number
  // 判断是否是内地股票字段为 stockType：内地：stdStock，非内地：overseas
  stockType?: 'stdStock' | 'overseas'
}
