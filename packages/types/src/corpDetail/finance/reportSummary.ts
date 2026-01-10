export type FinancialReportSummaryItem = {
  companyCode: string
  _reportDate: string
  obObjectName: string
  _regionType: string
  _reportType: string
  _reportTemplate: string
  codeType: string
  _reportPeriod?: string

  _sumBusinessIncome?: number
  _sumBusinessIncomeMag?: string
  _sumBusinessIncomeDim?: string
  _businessProfit?: number
  _businessProfitMag?: string
  _businessProfitDim?: string
  _netProfit?: number
  _netProfitMag?: string
  _netProfitDim?: string
  _netProfit2?: number
  _netProfit2Mag?: string
  _netProfit2Dim?: string
  _sumProfit?: number
  _sumProfitMag?: string
  _sumProfitDim?: string
  _sumBusinessCost?: number
  _sumBusinessCostMag?: string
  _sumBusinessCostDim?: string
  _nonRecurringGainsAndLosses?: number
  _nonRecurringGainsAndLossesMag?: string
  _nonRecurringGainsAndLossesDim?: string
  _netProfitAfterDeductingNonRecurring?: number
  _netProfitAfterDeductingNonRecurringMag?: string
  _netProfitAfterDeductingNonRecurringDim?: string
  _rdExpenses?: number
  _rdExpensesMag?: string
  _rdExpensesDim?: string
  _ebit?: number
  _ebitMag?: string
  _ebitDim?: string
  _ebitda?: number
  _ebitdaMag?: string
  _ebitdaDim?: string

  _sumOfAsset?: number
  _sumOfAssetMag?: string
  _sumOfAssetDim?: string
  _sumOfDebt?: number
  _sumOfDebtMag?: string
  _sumOfDebtDim?: string
  _sumOfHolderRightsAndInterests1?: number
  _sumOfHolderRightsAndInterests1Mag?: string
  _sumOfHolderRightsAndInterests1Dim?: string
  _sumOfHolderRightsAndInterests2?: number
  _sumOfHolderRightsAndInterests2Mag?: string
  _sumOfHolderRightsAndInterests2Dim?: string
  _currentLiabilities?: number
  _currentLiabilitiesMag?: string
  _currentLiabilitiesDim?: string
  _noncurrentLiabilities?: number
  _noncurrentLiabilitiesMag?: string
  _noncurrentLiabilitiesDim?: string
  _currentAssets?: number
  _currentAssetsMag?: string
  _currentAssetsDim?: string
  _fixedAssets?: number
  _fixedAssetsMag?: string
  _fixedAssetsDim?: string
  _longTermEquityInvestment?: number
  _longTermEquityInvestmentMag?: string
  _longTermEquityInvestmentDim?: string
  _capitalReserve?: number
  _capitalReserveMag?: string
  _capitalReserveDim?: string
  _surplusReserve?: number
  _surplusReserveMag?: string
  _surplusReserveDim?: string
  _undistributedProfit?: number
  _undistributedProfitMag?: string
  _undistributedProfitDim?: string

  _sumOfBusinessCash?: number
  _sumOfBusinessCashMag?: string
  _sumOfBusinessCashDim?: string
  _sumOfBusinessCashPayout?: number
  _sumOfBusinessCashPayoutMag?: string
  _sumOfBusinessCashPayoutDim?: string
  _netNumberOfBusinessCashPayout2?: number
  _netNumberOfBusinessCashPayout2Mag?: string
  _netNumberOfBusinessCashPayout2Dim?: string
  _sumOfOtherBusinessCashIn?: number
  _sumOfOtherBusinessCashInMag?: string
  _sumOfOtherBusinessCashInDim?: string
  _sumOfInvestmentCashOut?: number
  _sumOfInvestmentCashOutMag?: string
  _sumOfInvestmentCashOutDim?: string
  _netCashOfInvestment?: number
  _netCashOfInvestmentMag?: string
  _netCashOfInvestmentDim?: string
  _sumOfChipingCapital?: number
  _sumOfChipingCapitalMag?: string
  _sumOfChipingCapitalDim?: string
  _sumForChippingCapital?: number
  _sumForChippingCapitalMag?: string
  _sumForChippingCapitalDim?: string
  _netNumberForChippingCapital?: number
  _netNumberForChippingCapitalMag?: string
  _netNumberForChippingCapitalDim?: string
}

export const ReportTemplateEnum = {
  ANNUAL_CUMULATIVE: '年报&累计报',
  ANNUAL_QUARTERLY: '年报&单季报',
} as const
export type ReportTemplateType = (typeof ReportTemplateEnum)[keyof typeof ReportTemplateEnum]

export const ReportTypeEnum = {
  MERGE: '合并报表',
  ADJUSTMENT: '合并调整',
} as const
export type ReportTypeEnum = (typeof ReportTypeEnum)[keyof typeof ReportTypeEnum]

export const RegionTypeEnum = {
  CN: '境内',
  OE: '境外',
  ALL: '全部',
} as const
export type RegionTypeEnum = (typeof RegionTypeEnum)[keyof typeof RegionTypeEnum]

export interface FinancialReportSummaryProps {
  regionType?: RegionTypeEnum
  reportTemplate?: ReportTemplateType
  reportType?: ReportTypeEnum
  reportDate?: [number | null, number | null]
}
