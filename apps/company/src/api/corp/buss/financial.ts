import { BalanceSheetData, CashFlowData, FinancialIndicatorData, ProfitData } from 'gel-types'

// Type guards for financial response types
export const isProfitResponse = (res: any[]): res is ProfitData[] => {
  if (!res?.length) return false
  const item = res[0]
  return (
    '_businessProfit' in item ||
    '_netProfit2' in item ||
    '_reportDate' in item ||
    '_sumBusinessIncome' in item ||
    '_sumProfit' in item ||
    'companyCode' in item
  )
}

export const isBalanceSheetResponse = (res: any[]): res is BalanceSheetData[] => {
  if (!res?.length) return false
  const item = res[0]
  return (
    '_reportDate' in item ||
    '_sumOfAsset' in item ||
    '_sumOfDebt' in item ||
    '_sumOfHolderRightsAndInterests1' in item ||
    '_sumOfHolderRightsAndInterests2' in item ||
    'companyCode' in item
  )
}

export const isCashFlowResponse = (res: any[]): res is CashFlowData[] => {
  if (!res?.length) return false
  const item = res[0]
  return (
    '_netCashOfInvestment' in item ||
    '_netNumberForChippingCapital' in item ||
    '_netNumberOfBusinessCashPayout2' in item ||
    '_reportDate' in item ||
    '_sumForChippingCapital' in item ||
    '_sumOfBusinessCash' in item ||
    '_sumOfBusinessCashPayout' in item ||
    '_sumOfChipingCapital' in item ||
    '_sumOfInvestmentCashOut' in item ||
    '_sumOfOtherBusinessCashIn' in item ||
    'companyCode' in item
  )
}

export const isFinancialIndicatorResponse = (res: any[]): res is FinancialIndicatorData[] => {
  if (!res?.length) return false
  const item = res[0]
  return (
    'assentDebtRate' in item ||
    'floatingProporting' in item ||
    'rawProfitOfSaling' in item ||
    'reportDate' in item ||
    'singQuarterNetProfitGrowth' in item ||
    'speedProportiong' in item ||
    'yearNetAssetGuerdonRate' in item ||
    'yearNetAssetProfitRate' in item ||
    'manageProfitDivideTaking' in item ||
    'saleNetProfit' in item ||
    'yearOfInvestAssetIncome' in item ||
    'stockType' in item
  )
}
