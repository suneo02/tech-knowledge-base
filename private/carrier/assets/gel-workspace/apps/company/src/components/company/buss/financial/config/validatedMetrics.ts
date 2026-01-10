/**
 * 指标集合与组头配置：定义利润表、资产负债表、现金流量表的指标键与中文标签。
 * @author yxlu.calvin
 * @example
 * const profitSet = listedBondIssuerProfitStatement
 * const headers = groupHeaders
 */
import { t } from 'gel-util/intl'
export type FinancialMetric = { key: string; label: string }

const STRINGS = {
  SUM_BUSINESS_INCOME: t('35216', '营业总收入'),
  BUSINESS_PROFIT: t('97942', '营业利润'),
  SUM_PROFIT_TAX: t('128892', '税前利润'),
  NET_PROFIT2_OWNER: t('6821', '归属母公司股东净利润'),
  SUM_OF_ASSET: t('45337', '资产总计'),
  SUM_OF_DEBT: t('46149', '负债合计'),
  SUM_OF_HOLDER_RIGHTS_TOTAL: t('138784', '股东权益合计'),
  SUM_OF_HOLDER_RIGHTS: t('32968', '股东权益'),
  SUM_OF_HOLDER_RIGHTS_AND_INTERESTS1: t('6822', '归属母公司股东权益'),
  NET_NUMBER_OF_BUSINESS_CASH_PAYOUT2_FULL: t('33472', '经营活动产生的现金流量净额'),
  NET_CASH_OF_INVESTMENT_FULL: t('34662', '投资活动产生的现金流量净额'),
  NET_NUMBER_FOR_CHIPPING_CAPITAL_FULL: t('3044', '筹资活动产生的现金流量净额'),
  SUM_BUSINESS_COST: t('35210', '营业总成本'),
  SUM_PROFIT_TOTAL: t('66268', '利润总额'),
  NET_PROFIT: t('42124', '净利润'),
  NET_PROFIT2_OWNER_ALT: t('33028', '归属母公司股东的净利润'),
  NON_RECURRING_GAINS_AND_LOSSES: t('26827', '非经常性损益'),
  NET_PROFIT_AFTER_DEDUCTING_NON_RECURRING: t('64616', '扣非后归属母公司股东的净利润'),
  RD_EXPENSES: t('117922', '研发支出'),
  CURRENT_ASSETS: t('45675', '流动资产'),
  FIXED_ASSETS: t('53257', '固定资产'),
  LONG_TERM_EQUITY_INVESTMENT: t('2555', '长期股权投资'),
  CURRENT_LIABILITIES: t('33682', '流动负债'),
  NON_CURRENT_LIABILITIES: t('32790', '非流动负债'),
  CAPITAL_RESERVE: t('35800', '资本公积金'),
  SURPLUS_RESERVE: t('35238', '盈余公积金'),
  UNDISRIBUTED_PROFIT: t('66195', '未分配利润'),
  CASH_RECEIVED_FROM_GOODS_AND_SERVICES: t('64617', '销售商品提供劳务收到的现金'),
  NET_NUMBER_OF_BUSINESS_CASH_PAYOUT2_SHORT: t('64618', '经营活动现金净流量'),
  CASH_PAID_FOR_FIXED_INTANGIBLE_ASSETS: t('64619', '购建固定无形长期资产支付的现金'),
  CASH_PAID_FOR_INVESTMENTS: t('34701', '投资支付的现金'),
  CASH_RECEIVED_FROM_INVESTMENTS: t('34804', '吸收投资收到的现金'),
  CASH_RECEIVED_FROM_BORROWINGS: t('34161', '取得借款收到的现金'),
  NET_INCREASE_IN_CASH: t('15204', '现金净增加额'),
  CASH_BALANCE_AT_END_OF_PERIOD: t('64622', '期末现金余额'),
  DEPRECIATION_AND_AMORTIZATION: t('35598', '折旧与摊销'),
  OPERATING_EXPENDITURE: t('98406', '营业总支出'),
  FINANCIAL_STATEMENT_PROFIT: t('27167', '利润表'),
  FINANCIAL_STATEMENT_BALANCE: t('27166', '资产负债表'),
  FINANCIAL_STATEMENT_CASH: t('27168', '现金流量表'),
  NET_NUMBER_FOR_CHIPPING_CAPITAL: t('478994', '筹资活动净流量'),
  CAPITAL_EXPENDITURE: t('117698', '资本支出'),
} as const

// export const listedNonBondIssuerProfitStatement: FinancialMetric[] = [
//   { key: '_sumBusinessIncome', label: STRINGS.SUM_BUSINESS_INCOME },
//   { key: '_businessProfit', label: STRINGS.BUSINESS_PROFIT },
//   { key: '_sumProfit', label: STRINGS.SUM_PROFIT_TAX },
//   { key: '_netProfit2', label: STRINGS.NET_PROFIT2_OWNER },
// ]

// export const listedNonBondIssuerBalanceSheet: FinancialMetric[] = [
//   { key: '_sumOfAsset', label: STRINGS.SUM_OF_ASSET },
//   { key: '_sumOfDebt', label: STRINGS.SUM_OF_DEBT },
//   { key: '_sumOfHolderRights', label: STRINGS.SUM_OF_HOLDER_RIGHTS_TOTAL },
//   { key: '_sumOfHolderRightsAndInterests1', label: STRINGS.SUM_OF_HOLDER_RIGHTS_AND_INTERESTS1 },
// ]

// export const listedNonBondIssuerCashFlowStatement: FinancialMetric[] = [
//   { key: '_netNumberOfBusinessCashPayout2', label: STRINGS.NET_NUMBER_OF_BUSINESS_CASH_PAYOUT2_FULL },
//   { key: '_netCashOfInvestment', label: STRINGS.NET_CASH_OF_INVESTMENT_FULL },
//   { key: '_netNumberForChippingCapital', label: STRINGS.NET_NUMBER_FOR_CHIPPING_CAPITAL_FULL },
// ]

// 上市发债公司资产负债表
export const listedBondIssuerBalanceSheet: FinancialMetric[] = [
  { key: '_currentAssets', label: STRINGS.CURRENT_ASSETS },
  { key: '_fixedAssets', label: STRINGS.FIXED_ASSETS },
  { key: '_longTermEquityInvestment', label: STRINGS.LONG_TERM_EQUITY_INVESTMENT },
  { key: '_sumOfAsset', label: STRINGS.SUM_OF_ASSET },
  { key: '_currentLiabilities', label: STRINGS.CURRENT_LIABILITIES },
  { key: '_nonCurrentLiabilities', label: STRINGS.NON_CURRENT_LIABILITIES },
  { key: '_sumOfDebt', label: STRINGS.SUM_OF_DEBT },
  { key: '_sumOfHolderRightsAndInterests2', label: STRINGS.SUM_OF_HOLDER_RIGHTS },
  { key: '_sumOfHolderRightsAndInterests1', label: STRINGS.SUM_OF_HOLDER_RIGHTS_AND_INTERESTS1 },
  { key: '_capitalReserve', label: STRINGS.CAPITAL_RESERVE },
  { key: '_surplusReserve', label: STRINGS.SURPLUS_RESERVE },
  { key: '_undistributedProfit', label: STRINGS.UNDISRIBUTED_PROFIT },
]

// 上市发债公司利润表
export const listedBondIssuerProfitStatement: FinancialMetric[] = [
  { key: '_sumBusinessIncome', label: STRINGS.SUM_BUSINESS_INCOME },
  { key: '_sumBusinessCost', label: STRINGS.SUM_BUSINESS_COST },
  { key: '_businessProfit', label: STRINGS.BUSINESS_PROFIT },
  { key: '_sumProfit', label: STRINGS.SUM_PROFIT_TOTAL },
  { key: '_netProfit', label: STRINGS.NET_PROFIT },
  { key: '_netProfit2', label: STRINGS.NET_PROFIT2_OWNER_ALT },
  { key: '_nonRecurringGainsAndLosses', label: STRINGS.NON_RECURRING_GAINS_AND_LOSSES },
  { key: '_netProfitAfterDeductingNonRecurring', label: STRINGS.NET_PROFIT_AFTER_DEDUCTING_NON_RECURRING },
  { key: '_rdExpenses', label: STRINGS.RD_EXPENSES },
  { key: '_ebit', label: 'EBIT' },
  { key: '_ebitda', label: 'EBITDA' },
]

// 上市发债公司现金流量表
export const listedBondIssuerCashFlowStatement: FinancialMetric[] = [
  { key: '_cashReceivedFromGoodsAndServices', label: STRINGS.CASH_RECEIVED_FROM_GOODS_AND_SERVICES },
  { key: '_netNumberOfBusinessCashPayout2', label: STRINGS.NET_NUMBER_OF_BUSINESS_CASH_PAYOUT2_SHORT },
  { key: '_cashPaidForFixedIntangibleAssets', label: STRINGS.CASH_PAID_FOR_FIXED_INTANGIBLE_ASSETS },
  { key: '_cashPaidForInvestments', label: STRINGS.CASH_PAID_FOR_INVESTMENTS },
  { key: '_netCashOfInvestment', label: STRINGS.NET_CASH_OF_INVESTMENT_FULL },
  { key: '_cashReceivedFromInvestments', label: STRINGS.CASH_RECEIVED_FROM_INVESTMENTS },
  { key: '_cashReceivedFromBorrowings', label: STRINGS.CASH_RECEIVED_FROM_BORROWINGS },
  { key: '_netNumberForChippingCapital', label: STRINGS.NET_NUMBER_FOR_CHIPPING_CAPITAL_FULL },
  { key: '_netIncreaseInCash', label: STRINGS.NET_INCREASE_IN_CASH },
  { key: '_cashBalanceAtEndOfPeriod', label: STRINGS.CASH_BALANCE_AT_END_OF_PERIOD },
  { key: '_depreciationAndAmortization', label: STRINGS.DEPRECIATION_AND_AMORTIZATION },
]

export const overseasCompanyProfitStatement: FinancialMetric[] = [
  { key: '_sumBusinessIncome', label: STRINGS.SUM_BUSINESS_INCOME },
  { key: '_sumBusinessCost', label: STRINGS.OPERATING_EXPENDITURE },
  { key: '_businessProfit', label: STRINGS.BUSINESS_PROFIT },
  { key: '_sumProfit', label: STRINGS.SUM_PROFIT_TAX },
  { key: '_netProfit', label: STRINGS.NET_PROFIT },
  { key: '_netProfitAfterDeductingNonRecurring', label: STRINGS.NET_PROFIT_AFTER_DEDUCTING_NON_RECURRING },
  { key: '_rdExpenses', label: STRINGS.RD_EXPENSES },
  { key: '_ebit', label: 'EBIT' },
  { key: '_ebitda', label: 'EBITDA' },
]

export const overseasCompanyBalanceSheet: FinancialMetric[] = [
  { key: '_currentAssets', label: STRINGS.CURRENT_ASSETS },
  { key: '_fixedAssets', label: STRINGS.FIXED_ASSETS },
  { key: '_sumOfAsset', label: STRINGS.SUM_OF_ASSET },
  { key: '_currentLiabilities', label: STRINGS.CURRENT_LIABILITIES },
  { key: '_nonCurrentLiabilities', label: STRINGS.NON_CURRENT_LIABILITIES },
  { key: '_sumOfDebt', label: STRINGS.SUM_OF_DEBT },
  { key: '_sumOfHolderRightsAndInterests2', label: STRINGS.SUM_OF_HOLDER_RIGHTS },
  { key: '_sumOfHolderRightsAndInterests1', label: STRINGS.SUM_OF_HOLDER_RIGHTS_AND_INTERESTS1 },
]

export const overseasCompanyCashFlowStatement: FinancialMetric[] = [
  { key: '_netNumberOfBusinessCashPayout2', label: STRINGS.NET_NUMBER_OF_BUSINESS_CASH_PAYOUT2_SHORT },
  { key: '_netCashOfInvestment', label: STRINGS.NET_CASH_OF_INVESTMENT_FULL },
  { key: '_netNumberForChippingCapital', label: STRINGS.NET_NUMBER_FOR_CHIPPING_CAPITAL },
  { key: '_netIncreaseInCash', label: STRINGS.NET_INCREASE_IN_CASH },
  { key: '_cashBalanceAtEndOfPeriod', label: STRINGS.CASH_BALANCE_AT_END_OF_PERIOD },
  { key: '_capitalExpenditure', label: STRINGS.CAPITAL_EXPENDITURE },
]

export type GroupHeaderRow = {
  label: string
  __rowType: 'title'
  __group: 'profit' | 'balance' | 'cash'
}

export const groupHeaders: Record<'profit' | 'balance' | 'cash', GroupHeaderRow> = {
  profit: { label: STRINGS.FINANCIAL_STATEMENT_PROFIT, __rowType: 'title', __group: 'profit' },
  balance: { label: STRINGS.FINANCIAL_STATEMENT_BALANCE, __rowType: 'title', __group: 'balance' },
  cash: { label: STRINGS.FINANCIAL_STATEMENT_CASH, __rowType: 'title', __group: 'cash' },
}
