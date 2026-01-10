import { RegionTypeEnum } from './reportSummary'

export interface FinancialReportIndicatorProps {
  regionType?: RegionTypeEnum
  reportDate?: [number | null, number | null]
}

export type FinancialIndicatorItem = {
  _assentDebtRate?: number
  _floatingProporting?: number
  _rawProfitOfSaling?: number
  _reportDate: string
  _reportPeriod: string
  _singQuarterNetProfitGrowth?: number
  _speedProportiong?: number
  _yearNetAssetGuerdonRate?: number
  _yearNetAssetProfitRate?: number
  _manageProfitDivideTaking?: number
  _saleNetProfit?: number
  _yearOfInvestAssetIncome?: number
  _regionType?: string
}

export type FinancialIndicatorResponse = {
  aggregations: {
    reportDate: {
      value: string[]
    }
  }
  list: FinancialIndicatorItem[]
}
