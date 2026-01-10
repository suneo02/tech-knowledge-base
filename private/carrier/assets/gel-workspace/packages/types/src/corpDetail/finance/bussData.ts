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
  _assentDebtRate?: number
  // 流动比率
  _floatingProporting?: number
  // 销售毛利率 / 毛利率
  _rawProfitOfSaling?: number
  // 截止日期
  _reportDate: string
  // 报告期
  _reportPeriod: string
  // 净利润增长率
  _singQuarterNetProfitGrowth?: number
  // 速动比率
  _speedProportiong?: number
  // 总资产回报率
  _yearNetAssetGuerdonRate?: number
  // 净资产收益率
  _yearNetAssetProfitRate?: number
  // 经营利润率
  _manageProfitDivideTaking?: number
  // 净利润率
  _saleNetProfit?: number
  // 投入资本回报率
  _yearOfInvestAssetIncome?: number
  // 境内/境外
  _regionType?: string
}
